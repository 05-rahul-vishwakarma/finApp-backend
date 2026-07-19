import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(registerDto: RegisterDto): Promise<{ message: string; user: { id: string; phoneNumber: string; fullName: string } }> {
    // Check if phone number already exists
    const existingPhoneUser = await this.prisma.user.findUnique({
      where: { phoneNumber: registerDto.phoneNumber },
      select: { id: true },
    });

    if (existingPhoneUser) {
      throw new ConflictException('A user with this phone number already exists');
    }

    // Check if email already exists (only if email is provided)
    if (registerDto.email) {
      const existingEmailUser = await this.prisma.user.findUnique({
        where: { email: registerDto.email },
        select: { id: true },
      });

      if (existingEmailUser) {
        throw new ConflictException('A user with this email address already exists');
      }
    }

    const user = await this.prisma.user.create({
      data: {
        phoneNumber: registerDto.phoneNumber,
        fullName: registerDto.fullName,
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

    return {
      message: 'User registered successfully',
      user,
    };
  }
}
