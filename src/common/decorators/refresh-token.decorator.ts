import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import moment = require('moment');
import { RefreshTokenEntity } from 'src/auth/entities/refresh-token.entity';
import { getRepository } from 'typeorm';

export const RefreshToken = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const refreshTokenReq = request.body.refreshToken;

    if (refreshTokenReq && refreshTokenReq.split('_').length !== 2)
      throw new ForbiddenException('RefreshToken invalid format');

    const refreshToken: string = refreshTokenReq.split('_')[0];
    const refreshTokenId: string = refreshTokenReq.split('_')[1];

    return await getRepository<RefreshTokenEntity>(RefreshTokenEntity)
      .findOne(refreshTokenId, { relations: ['user'] })
      .then(refreshTokenEntry => {
        if (
          refreshTokenEntry &&
          refreshTokenEntry.refreshToken === refreshToken
        ) {
          const isExpired = moment().isAfter(moment(refreshTokenEntry.expirationTime));
          if (isExpired) throw new UnauthorizedException('Token has expired');

          refreshTokenEntry.newRefreshToken = request.body.refreshToken;
          return refreshTokenEntry;
        } else throw new UnauthorizedException('Token invalid or has expired')
      });
  },
);
