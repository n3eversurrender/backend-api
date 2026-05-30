import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/cores/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/cores/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/cores/guards/local-auth.guard';
import { JoiValidationPipe } from 'src/cores/validators/pipes/joi-validation.pipe';
import { CreateUserDto } from 'src/features/auth/dto/create-user.dto';
import { AuthService } from './auth.service';
import { registerSchema } from './validations/requests/register.request';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  register(
    @Body(new JoiValidationPipe(registerSchema)) createUserDto: CreateUserDto,
  ) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@CurrentUser() user) {
    return this.authService.profile(user);
  }
}
