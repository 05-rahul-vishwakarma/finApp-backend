import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  register(): { message: string } {
    return {
      message: 'User registered successfully',
    };
  }
}
