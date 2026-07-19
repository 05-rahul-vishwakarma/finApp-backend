import { Injectable, ConflictException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(registerDto: RegisterDto): Promise<{ message: string; user: { id: string; phoneNumber: string; fullName: string } }> {
    // Check if phone number already exists
    const existingPhoneUser = await this.userService.findByPhoneNumber(registerDto.phoneNumber);

    if (existingPhoneUser) {
      throw new ConflictException('A user with this phone number already exists');
    }

    // Check if email already exists (only if email is provided)
    if (registerDto.email) {
      const existingEmailUser = await this.userService.findByEmail(registerDto.email);

      if (existingEmailUser) {
        throw new ConflictException('A user with this email address already exists');
      }
    }

    const user = await this.userService.create(registerDto);

    return {
      message: 'User registered successfully',
      user,
    };
  }
}
