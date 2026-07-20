import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UserService {
  private readonly saltRounds = 12;

  constructor(private readonly prisma: PrismaService) {}

  async findByPhoneNumber(phoneNumber: string) {
    return this.prisma.user.findUnique({
      where: { phoneNumber },
      select: { id: true },
    });
  }

  async loginDetails(phoneNumber:string) {
    return this.prisma.user.findUnique({
      where: { phoneNumber },
      select: {
      id: true,
      fullName: true,
      phoneNumber: true,
      password: true,
      role:true,
    },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
  }

  async create(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, this.saltRounds);

    return this.prisma.user.create({
      data: {
        phoneNumber: registerDto.phoneNumber,
        fullName: registerDto.fullName,
        password: hashedPassword,
        email: registerDto.email,
        monthlyIncome: registerDto.monthlyIncome,
        currencyCode: registerDto.currencyCode,
      },
      select: {
        id: true,
        phoneNumber: true,
        fullName: true,
      },
    });
  }

  async getUserDetails(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phoneNumber: true,
        fullName: true,
        email: true,
        monthlyIncome: true,
        currencyCode: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return {
        message: 'User not found',
        details: null,
      };
    }

    return {
      message: 'Successfully fetched user details',
      details: user,
    };
  }
}
