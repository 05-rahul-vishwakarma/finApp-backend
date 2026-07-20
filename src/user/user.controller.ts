import { Controller, Get, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('details')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async details(@Req() req: any) {
    const userId = req.user.id;
    return this.userService.getUserDetails(userId);
  }
}
