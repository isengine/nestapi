import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class VerifyHandler {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async verify(token: string, type: string): Promise<any> {
    let result;
    try {
      result = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Invalid token or expired!');
    }
    if (!result || !result.type || result.type !== type) {
      throw new UnauthorizedException('Invalid token or expired!');
    }
    return result;
  }
}
