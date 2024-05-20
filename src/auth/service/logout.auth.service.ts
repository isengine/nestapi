import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionsService } from '@src/sessions/sessions.service';

@Injectable()
export class LogoutAuthService {
  constructor(
    protected readonly sessionsService: SessionsService,
  ) {}

  async logout(request: any = null): Promise<boolean> {
    if (!request || !request?.user) {
      return false;
    }
    try {
      await this.sessionsService.destroySession(request?.user, request);
    } catch {
      throw new UnauthorizedException('Session does not exist!');
    }
    delete request.user;
    return true;
  }
}
