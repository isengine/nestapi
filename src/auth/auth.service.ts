import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, genSalt, hash } from 'bcryptjs';
import { Repository } from 'typeorm';

import { AuthEntity } from '@src/auth/auth.entity';
import { AuthDto } from '@src/auth/auth.dto';
import { UsersService } from '@src/users/users.service';
import { SessionsService } from '@src/sessions/sessions.service';
import { TokensService } from '@src/tokens/tokens.service';
import { ConfirmService } from '@src/confirm/confirm.service';
import { CommonService } from '@src/common/service/common.service';
import { AuthFilter } from '@src/auth/auth.filter';
import { RelationsDto } from '@src/common/dto/relations.dto';

@Injectable()
export class AuthService extends CommonService<
  AuthEntity,
  AuthDto,
  AuthFilter
> {
  constructor(
    @InjectRepository(AuthEntity)
    protected readonly repository: Repository<AuthEntity>,
    protected readonly userService: UsersService,
    protected readonly sessionsService: SessionsService,
    protected readonly tokensService: TokensService,
    protected readonly confirmService: ConfirmService,
  ) {
    super();
  }

  async login(authDto: AuthDto, request: any = null): Promise<AuthEntity> {
    const auth = await this.findByUsername(authDto.username);
    if (!auth) {
      throw new UnauthorizedException('User not found');
    }
    const isValidPassword = await compare(authDto.password, auth.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }
    const tokens = await this.tokensService.tokensCreatePair(auth);
    if (request) {
      await this.sessionsService.createSession(auth, tokens, request);
    }
    auth.tokens = tokens;
    return auth;
  }

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

  async register(authDto: AuthDto, request: any = null): Promise<AuthEntity> {
    const authExists = await this.findByUsername(authDto.username);
    if (authExists) {
      throw new BadRequestException(
        'User with this username is already in the system',
      );
    }
    const salt = await genSalt(10);
    authDto.password = await hash(authDto.password, salt);

    // используйте данную строку, если пользователь будет сразу же активирован
    // authDto.isActivated = true;

    const auth = await this.create(authDto);
    const tokens = await this.tokensService.tokensCreatePair(auth);
    if (request) {
      await this.sessionsService.createSession(auth, tokens, request);
    }
    auth.tokens = tokens;

    // закомментируйте строки ниже, если пользователь будет сразу же активирован
    // используйте confirmGenerate чтобы генерировать код из цифр
    const confirm = await this.confirmService.confirmCreate(auth);
    auth.confirm = [confirm];

    return auth;
  }

  async confirm(code: string): Promise<boolean> {
    const confirm = await this.confirmService.confirmValidate(code);
    if (confirm) {
      const { auth } = confirm;
      await super.update(auth.id, {
        isActivated: true,
      });
    }
    return !!confirm;
  }

  async restore(authDto: AuthDto, code: string): Promise<boolean> {
    const confirm = await this.confirmService.confirmValidate(code);
    if (!confirm) {
      throw new BadRequestException('Restore code is not valid');
    }
    const { auth } = confirm;
    if (!auth || auth.username !== authDto.username) {
      throw new UnauthorizedException('User not found');
    }
    const salt = await genSalt(10);
    const password = await hash(authDto.password, salt);
    await super.update(auth.id, {
      password,
    });
    return !!confirm;
  }

  async restorePrepare(authDto: AuthDto): Promise<boolean> {
    const auth = await this.findByUsername(authDto.username);
    if (!auth) {
      throw new UnauthorizedException('User not found');
    }
    const confirm = await this.confirmService.confirmCreate(auth);
    return !!confirm;
  }

  async findByUsername(username: string): Promise<AuthEntity> {
    return await this.repository.findOneBy({ username });
  }

  async create(
    authDto: AuthDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<AuthEntity> {
    const result = await super.create(authDto, relationsDto);
    await this.userService.create({
      email: result.username,
      auth: {
        id: result.id,
      },
    });
    return result;
  }

  async update(
    id: number,
    authDto: AuthDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<AuthEntity> {
    const result = await super.update(id, authDto, relationsDto);
    await this.userService.update(result.id, {
      email: result.username,
      auth: {
        username: result.username,
        isActivated: result.isActivated,
      },
    });
    return result;
  }
}
