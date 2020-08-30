import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards";


export function Auth() {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth()
  )
}