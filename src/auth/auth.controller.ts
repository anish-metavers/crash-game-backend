import { Controller, Post, Body, UseFilters, UseGuards } from '@nestjs/common';
import { HttpExceptionFilter } from 'exception/httpExceptionFilter';
import { AuthGuard } from 'guard/authGuard';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/create-auth.dto';

@UseFilters(HttpExceptionFilter)
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  async signup(@Body() signup: SignupDto) {
    return this.authService.signupUser(signup);
  }

  @Post('/login')
  login(@Body() login: LoginDto) {
    return this.authService.loginUser(login);
  }
}
