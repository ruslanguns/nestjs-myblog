import {
  BadGatewayException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { MailerService } from '@nestjs-modules/mailer';
import * as moment from 'moment';
import { UserService } from '../user/user.service';
import { User } from 'src/user/entities';
import { ForgetPasswordDto, ResetPasswordDto } from './dtos';
import { IJwtPayload } from '../common/interfaces';
import { getConnection, getRepository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
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

  login(user: User) {
    const { id, ...rest } = user;
    return {
      user,
      accessToken: this.jwtService.sign({ sub: id }),
    };
  }

  async forget({ email }: ForgetPasswordDto) {
    const user = await this.userService.findOne({ email });
    if (!user) throw new NotFoundException('This account does not exist');

    const token = this.jwtService.sign({ sub: user.id }, { expiresIn: '5m' });
    this.sendForgetPasswordEmail(user, token);
    return {
      message: 'Email with password recovery instruction sent',
      data: null,
    };
  }

  async reset({ password, token }: ResetPasswordDto) {
    await this.jwtService.verifyAsync(token).catch(({ message }) => {
      throw new UnauthorizedException({ message, data: null });
    });

    const { sub: id } = this.jwtService.decode(token) as IJwtPayload;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    const user = await this.userService.findOne({ id });

    if (!user) throw new NotFoundException('This account does not exist');

    await queryRunner.connect();

    try {
      const userEdited = Object.assign(user, { password });
      await queryRunner.manager.save(userEdited);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadGatewayException({
        message: 'There are issues saving your new password',
        data: null,
      });
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
