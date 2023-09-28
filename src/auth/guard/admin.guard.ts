import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';

@Injectable()
export class OnlyAdminGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validate(request.user);
  }

  async validate(id) {
    const auth = await this.authService.authGetOne(id);

    if (!auth.rights) {
      throw new ForbiddenException('You have no rights!');
    }

    return !!auth.rights;
  }
}
