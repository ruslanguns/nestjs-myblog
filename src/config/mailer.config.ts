import { registerAs } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

// export const gmailTransporter = nodemailer.createTransport(
//   {
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   },
//   console.log(process.env.NODE_ENV),
// );

const mailerModuleOptions = (): MailerOptions => {
  return {
    transport: {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    },
    defaults: {
      from: `"${process.env.EMAIL_DEFAULT_FROM_NAME}" <${process.env.EMAIL_FROM_EMAIL}>`,
    },
    template: {
      dir: process.cwd() + '/template/layouts',
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
        viewEngine: {
          extname: '.hbs',
          partialsDir: process.cwd() + '/template/partials',
          defaultLayout: 'base',
          layoutsDir: process.cwd() + '/template/layouts',
        },
      },
    },
    options: {
      partials: {
        dir: process.cwd() + '/template/partials',
        options: {
          strict: true,
        },
        defaultLayout: 'base',
      },
      defaultLayout: 'base',
    },
  };
};

export default registerAs('mailer', () => ({
  config: mailerModuleOptions(),
}));
