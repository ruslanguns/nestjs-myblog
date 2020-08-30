import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { LocalAuthGuard, JwtAuthGuard } from './guards';
import { User, Auth } from 'src/common/decorators';
import { User as UserEntity } from 'src/user/entities';
import { AuthService } from './auth.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth routes')
@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @User() user: UserEntity
  ) {
    const data = await this.authService.login(user);
    return {
      message: 'Login exitoso',
      data
    }
  }

  @Auth()
  @Get('profile')
  profile(
    @User() user: UserEntity
  ) {
    return {
      message: 'Petición correcta',
      user
    }
  }

  @Auth()
  @Get('refresh')
  refreshToken(
    @User() user: UserEntity
  ) {
    const data = this.authService.login(user);
    return {
      message: 'Refresh exitoso',
      data
    }
  }

}
