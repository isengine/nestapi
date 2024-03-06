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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    private readonly userService: UsersService,
    private readonly sessionsService: SessionsService,
    private readonly tokensService: TokensService,
  ) {}

  async login(authDto: AuthDto, request: any = null): Promise<AuthDto> {
    const auth = await this.authGetByUsername(authDto.username);
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
    const authExists = await this.authGetByUsername(authDto.username);
    if (authExists) {
      throw new BadRequestException(
        'User with this username is already in the system',
      );
    }
    const salt = await genSalt(10);
    authDto.password = await hash(authDto.password, salt);
    const auth = await this.authCreate(authDto);
    const tokens = await this.tokensService.tokensCreatePair(auth);
    if (request) {
      await this.sessionsService.createSession(auth, tokens, request);
    }
    auth.tokens = tokens;
    return auth;
  }

  async authGetAll(): Promise<AuthEntity[]> {
    return await this.authRepository.find();
  }

  async authGetOne(id: number): Promise<AuthEntity> {
    return await this.authRepository.findOneBy({ id });
  }

  async authGetByUsername(username: string): Promise<AuthEntity> {
    return await this.authRepository.findOneBy({ username });
  }

  async authCreate(authDto: AuthDto): Promise<AuthEntity> {
    return await this.authRepository
      .save({ ...authDto })
      .then(async (result) => {
        await this.userService.usersCreate({
          email: result.username,
          auth: {
            id: result.id,
            username: result.username,
            isActivated: result.isActivated,
          },
        });
        return result;
      });
  }

  async authUpdate(authDto: AuthDto): Promise<AuthEntity> {
    const { id } = authDto;
    if (id === undefined) {
      return;
    }
    delete authDto.createdAt;
    delete authDto.updatedAt;
    await this.authRepository.save({ ...authDto }).then(async (result) => {
      await this.userService.usersUpdate({
        email: result.username,
        auth: {
          id: result.id,
          username: result.username,
          isActivated: result.isActivated,
        },
      });
      return result;
    });
    return await this.authGetOne(authDto.id);
  }

  async authRemove(id: number): Promise<boolean> {
    const result = await this.authRepository.delete({ id });
    return !!result?.affected;
  }
}
