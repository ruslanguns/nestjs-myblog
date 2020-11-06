import { IsUUID } from "class-validator";


export class RevokeSessionDto {
  @IsUUID("4", { message: 'Debe introducir un ID con formato correcto'})
  sessionId: string;
}