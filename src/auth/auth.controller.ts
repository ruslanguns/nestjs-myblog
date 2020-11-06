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
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { RevokeSessionDto } from './dtos/revoke-session.dto';

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

  @Post('refresh')
  async refreshToken(
    @RefreshToken()
    { user, newRefreshToken }: RefreshTokenEntity,
    @Body() dto: RefreshTokenDto
    ) {
    const data = await this.authService.refreshToken(user, newRefreshToken);
    return {
      message: 'Refresh exitoso',
      data,
    };
  }

  /**
   * Este método no desarticula el AccessToken Token sino que expira el Refresh Token para que no genere otro AccessToken
   * El AccessToken debe ser short life
   * TODO: Sería ideal meter una lógica para hacer un blacklist in-memory para los JWT, 
   * más información aquí: `https://medium.com/devgorilla/how-to-log-out-when-using-jwt-a8c7823e8a6`,
   * también aquí: `https://stackoverflow.com/questions/37959945/how-to-destroy-jwt-tokens-on-logout#:~:text=You%20cannot%20manually%20expire%20a,DB%20query%20on%20every%20request.`
   * @param refreshToken 
   */
  @Auth()
  @Post('logout')
  async logout(
    @RefreshToken()
    refreshToken: RefreshTokenEntity,
    @Body() dto: RefreshTokenDto
  ) {
    await this.authService.logout(refreshToken);
    return {
      message: 'Logout correcto',
      data: null
    }
  }

  @Auth()
  @Get('sessions')
  async getActiveSessions(
    @User() user: UserEntity
  ) {
    // TODO: Crear uno para el role de admin, para que pueda ver la de todos los usuarios.
    return {
      message: 'Sesiones activas del usuario',
      data: await this.authService.getActiveSessions(user)
    }
  }

  @Auth()
  @Patch('revoke-session')
  async revokeSession(
    @Body() dto: RevokeSessionDto
  ) {
    // TODO: Crear uno para el role de admin, para que pueda ver la de todos los usuarios.
    await this.authService.revokeSession(dto);
    return {
      message: 'Sessión revocada con éxito',
      data: null
    }
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
