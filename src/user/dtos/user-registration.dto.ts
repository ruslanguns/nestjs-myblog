import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';


export class UserRegistrationDto extends PartialType(
  OmitType(CreateUserDto, ['roles'] as const)
) {}
