import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

class LoginDto {
  email: string;
  password?: string;
}

@ApiTags('Auth & Users')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'User login for Sankaj Logistics WMS' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password || 'password123');
  }

  @Get('profile/:id')
  @ApiOperation({ summary: 'Get logged-in user profile' })
  async getProfile(@Param('id') id: string) {
    return this.authService.getProfile(id);
  }
}
