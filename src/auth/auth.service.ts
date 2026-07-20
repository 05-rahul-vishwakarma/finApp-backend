import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // ---------------- ACCESS TOKEN ----------------

  private async generateAccessToken(payload: {
    sub: string;
    role:string;
    sessionId: string;
  }) {
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
  }

  // ---------------- REFRESH TOKEN ----------------

  private async generateRefreshToken(payload: {
    sub: string;
    role:string;
    sessionId: string;
  }) {
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d',
    });
  }

  // ---------------- REGISTER ----------------
  async register(registerDto: RegisterDto) {
    const existingPhoneUser = await this.userService.findByPhoneNumber(
      registerDto.phoneNumber,
    );

    if (existingPhoneUser) {
      throw new ConflictException(
        'A user with this phone number already exists',
      );
    }

    if (registerDto.email) {
      const existingEmailUser = await this.userService.findByEmail(
        registerDto.email,
      );

      if (existingEmailUser) {
        throw new ConflictException(
          'A user with this email address already exists',
        );
      }
    }

    const user = await this.userService.create(registerDto);

    return {
      message: 'User registered successfully',
      user,
    };
  }

  // ---------------- LOGIN ----------------
  async login(loginDto: LoginDto, req: Request) {
    // 1. Find User
    const user = await this.userService.loginDetails(
      loginDto.phoneNumber,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Verify Password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Generate Session ID
    const sessionId = randomUUID();

    // 4. Generate Tokens
    const accessToken = await this.generateAccessToken({
      sub: user.id,
      role:user.role,
      sessionId,
    });

    const refreshToken = await this.generateRefreshToken({
      sub: user.id,
      role:user.role,
      sessionId,
    });

    // 5. Save Session
    await this.prisma.userSession.create({
      data: {
        id: sessionId,
        userId: user.id,
        refreshToken,
        deviceId: loginDto.deviceId,
        deviceName: loginDto.deviceName,
        deviceType: loginDto.deviceType,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] as string,
        expiresAt: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ),
      },
    });

    // 6. Return Response
    return {
      message: 'User logged in successfully',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
      },
    };
  }
}