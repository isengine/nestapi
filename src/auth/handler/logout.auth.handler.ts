import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthSessionsService } from '@src/auth_sessions/auth_sessions.service';

@Injectable()
export class LogoutAuthHandler {
  constructor(
    protected readonly authSessionsService: AuthSessionsService,
  ) {}

  async logout(
    request: any = null,
    response: any = null,
  ): Promise<boolean> {
    if (!request || !request?.user) {
      return false;
    }
    try {
      await this.authSessionsService.destroy(request?.user, request);
    } catch {
      throw new UnauthorizedException('Session does not exist!');
    }
    delete request.user;
    response.clearCookie('id');
    return true;
  }
}
