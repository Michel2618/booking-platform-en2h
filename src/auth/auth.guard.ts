import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedException('You must be logged in to do this.');
    }

    const token = authHeader.split(' ')[1]; 
    
    try {
      // to check the token is valid and not expired 
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'fallback_secret',
      });
      request['user'] = payload; 
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }
    return true;
  }
}