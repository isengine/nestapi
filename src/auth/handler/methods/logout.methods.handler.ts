import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthSessionsService } from '@src/auth_sessions/auth_sessions.service';

@Injectable()
export class LogoutMethodsHandler {
  constructor(
    protected readonly authSessionsService: AuthSessionsService,
  ) {}

  async logout(request: any = null): Promise<boolean> {
    if (!request || !request?.user) {
      return false;
    }
    try {
      await this.authSessionsService.destroy(request?.user, request);
    } catch {
      throw new UnauthorizedException('Session does not exist!');
    }
    delete request.user;
    return true;
  }
}
