import { IsEmail } from 'class-validator';

export class ForgetPasswordDto {
  @IsEmail()
  email: string;
}