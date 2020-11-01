import { IsJWT, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  password: string;
  @IsJWT()
  token: string;
}