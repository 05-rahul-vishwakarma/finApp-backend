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
}
