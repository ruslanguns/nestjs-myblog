import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AccessControlModule } from 'nest-access-control';
import { MailerOptions, MailerModule as MailerModulePackage } from '@nestjs-modules/mailer';
import * as Joi from '@hapi/joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { roles } from './app.roles';
import { TYPEORM_CONFIG, CONFIG_MAILER_CONFIG } from './config/constants';
import databaseConfig from './config/database.config';
import mailerConfig from './config/mailer.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.get<TypeOrmModuleOptions>(TYPEORM_CONFIG),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, mailerConfig],
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // .env.development
      validationSchema: Joi.object({ 
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development')
      }),
    }),
    AccessControlModule.forRoles(roles),
    MailerModulePackage.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get<MailerOptions>(CONFIG_MAILER_CONFIG),
      inject: [ConfigService]
    }),
    AuthModule,
    UserModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
