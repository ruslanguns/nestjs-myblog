import { Controller, Post, Get, UseGuards, Body, Patch, Param } from '@nestjs/common';
import { LocalAuthGuard } from './guards';
import { User, Auth } from 'src/common/decorators';
import { User as UserEntity } from 'src/user/entities';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { ForgetPasswordDto, ResetPasswordDto } from './dtos';
import { RefreshToken } from 'src/common/decorators/refresh-token.decorator';
import { RefreshTokenEntity } from './entities/refresh-token.entity';

// TODO: Refresh token persistant
@ApiTags('Auth routes')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @User() user: UserEntity) {
    const data = await this.authService.login(user);
    return {
      message: 'Login exitoso',
      data,
    };
  }

  @Auth()
  @Get('profile')
  profile(@User() user: UserEntity) {
    return {
      message: 'Petición correcta',
      user,
    };
  }

  // TODO: meter logica para revocar refreshToken (logout())
  // TODO: meter logica para ver sesiones activas
  @Post('refresh')
  async refreshToken(
    @RefreshToken()
    { user, newRefreshToken }: RefreshTokenEntity
    ) {
    const data = await this.authService.refreshToken(user, newRefreshToken);
    return {
      message: 'Refresh exitoso',
      data,
    };
  }

  
  @Post('forget')
  async forgetPassword(@Body() dto: ForgetPasswordDto) {
    return await this.authService.forget(dto);
  }

  @Patch('reset')
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ) {
    return await this.authService.reset(dto);
  }
}
