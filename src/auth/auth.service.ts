import {
  BadGatewayException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import * as moment from 'moment';
import { Equal, getConnection, Raw, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { User } from 'src/user/entities';
import { ForgetPasswordDto, ResetPasswordDto } from './dtos';
import { IJwtPayload } from '../common/interfaces';
import { generateRandomNumber } from 'src/common/helpers/generate-random-number.helper';
import { PasswordResetEntity } from './entities/password-reset.entity';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { RevokeSessionDto } from './dtos/revoke-session.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(PasswordResetEntity)
    private readonly passwordResetRepository: Repository<PasswordResetEntity>,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne({ email });

    if (user && (await compare(pass, user.password))) {
      const { password, ...rest } = user;
      return rest;
    }

    return null;
  }

  async login(user: User) {
    const { id, ...rest } = user;
    const createRefreshToken = this.refreshTokenRepository.create({ user });
    const { refreshToken } = await this.refreshTokenRepository.save(
      createRefreshToken,
    );
    return {
      user,
      accessToken: this.jwtService.sign({ sub: id }),
      refreshToken,
    };
  }

  async refreshToken(user: User, refreshToken: string) {
    const { id, ...rest } = user;
    return {
      user,
      accessToken: this.jwtService.sign({ sub: id }),
      refreshToken,
    };
  }

  async logout({id: sessionId}: RefreshTokenEntity) {
    await this.revokeSession({ sessionId });
    return;
  }

  async getActiveSessions(user: User) {
    return this.refreshTokenRepository.find({ where: {
      user: Equal(user.id),
      expirationTime: Raw(expirationDate => `${expirationDate} > NOW()`)
    }},)
  }

  async revokeSession({ sessionId }: RevokeSessionDto) {
    const refreshToken = await this.refreshTokenRepository.findOne(sessionId); 
    const refreshTokenEdited = Object.assign(refreshToken, {
      expirationTime: moment().toDate(),
    });
    return await this.refreshTokenRepository.save(refreshTokenEdited);
  }

  
  async forget({ email }: ForgetPasswordDto) {
    const user = await this.userService.findOne({ email });
    if (!user) throw new NotFoundException('This account does not exist');

    const passwordRecoveryPin = generateRandomNumber(1000, 9999);
    const passwordDbEntry = this.passwordResetRepository.create({
      pin: passwordRecoveryPin,
      user,
    });
    const token = this.jwtService.sign(
      { sub: user.id, passwordRecoveryPin },
      { expiresIn: '15m' },
    );

    await this.passwordResetRepository.save(passwordDbEntry);
    this.sendForgetPasswordEmail(user, token);

    return {
      message: 'Email with password recovery instruction sent',
      data: null,
    };
  }

  async reset({ password, token }: ResetPasswordDto) {
    await this.jwtService.verifyAsync(token).catch(() => {
      throw new UnauthorizedException(
        'Password reset token is invalid or has expired.',
      );
    });

    const { passwordRecoveryPin } = this.jwtService.decode(
      token,
    ) as IJwtPayload;
    const passwordRecoveryEntry = await this.passwordResetRepository.findOne({
      where: {
        pin: Equal(passwordRecoveryPin),
        used: false,
      },
      relations: ['user'],
    });

    if (!passwordRecoveryEntry)
      throw new NotAcceptableException('Password reset token is already used.');

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    const { user } = passwordRecoveryEntry;

    await queryRunner.connect();

    try {
      const userEdited = Object.assign(user, { password });
      const tokenUsed = Object.assign(passwordRecoveryEntry, { used: true });

      await queryRunner.manager.save(userEdited);
      await queryRunner.manager.save(tokenUsed);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadGatewayException(
        'There are issues saving your new password',
      );
    } finally {
      await queryRunner.release();

      return {
        message: 'Password has been changed successfuly',
        data: {
          accessToken: this.jwtService.sign({ sub: user.id }),
        },
      };
    }
  }

  async sendForgetPasswordEmail(
    { email: to, name, lastName }: Partial<User>,
    token: string,
  ) {
    const template = 'reset-password-notification';
    const now = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
    const context = { name, lastName, now, token };
    return await this.mailerService.sendMail({
      to,
      subject: `Reset password notification - [${now}]`,
      context,
      template,
    });
  }
}
