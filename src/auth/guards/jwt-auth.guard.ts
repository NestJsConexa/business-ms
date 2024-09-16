import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToRpc();
    const data = ctx.getData();

    const token = this.extractTokenFromData(data);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = this.jwtService.verify(token);

      context.switchToRpc().getContext()['user'] = {
        id: payload.sub,
        email: payload.email,
        iat: payload.iat,
      };
    } catch (error) {
      console.log('Error verificando el token:', error.message);
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromData(data: any): string | undefined {
    return data.paginationDto?.token;
  }
}
