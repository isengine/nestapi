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
  ) {
    super();
  }

  async login(authDto: AuthDto, request: any = null): Promise<AuthDto> {
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
    return true;
  }

  async register(authDto: AuthDto, request: any = null): Promise<AuthDto> {
    const authExists = await this.findByUsername(authDto.username);
    if (authExists) {
      throw new BadRequestException(
        'User with this username is already in the system',
      );
    }
    const salt = await genSalt(10);
    authDto.password = await hash(authDto.password, salt);
    const auth = await this.create(authDto);
    const tokens = await this.tokensService.tokensCreatePair(auth);
    if (request) {
      await this.sessionsService.createSession(auth, tokens, request);
    }
    auth.tokens = tokens;
    return auth;
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
        username: result.username,
        isActivated: result.isActivated,
      },
    });
    return result;
  }

  async update(
    authDto: AuthDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<AuthEntity> {
    const result = await super.update(authDto, relationsDto);
    await this.userService.update({
      email: result.username,
      auth: {
        id: result.id,
        username: result.username,
        isActivated: result.isActivated,
      },
    });
    return result;
  }
}
