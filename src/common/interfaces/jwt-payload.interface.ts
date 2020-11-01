export interface IJwtPayload {
  readonly sub: number;
  readonly iat?: number;
  readonly exp?: number;
}