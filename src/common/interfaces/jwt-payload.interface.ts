export interface IJwtPayload {
  readonly sub: number;
  readonly passwordRecoveryPin: number;
  readonly iat?: number;
  readonly exp?: number;
}