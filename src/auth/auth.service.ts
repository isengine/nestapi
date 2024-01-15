import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, genSalt, hash } from 'bcryptjs';
import { Repository } from 'typeorm';

import { AuthEntity } from '@src/auth/auth.entity';
import { AuthDto } from '@src/auth/dto/auth.dto';
import { MixinDto } from '@src/auth/dto/mixin.dto';
import { TokensDto } from '@src/auth/dto/tokens.dto';
import { UsersService } from '@src/users/users.service';
import { SessionService } from '@src/session/session.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    private readonly userService: UsersService,
    private readonly sessionService: SessionService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(authDto: AuthDto, request: any = null): Promise<MixinDto> {
    const auth = await this.authGetByUsername(authDto.username);
    if (!auth) {
      throw new UnauthorizedException('User not found');
    }
    const isValidPassword = await compare(authDto.password, auth.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }
    const tokens = await this.createTokensPair(auth);
    if (request) {
      await this.createSession(auth, tokens, request);
    }
    return {
      ...auth,
      ...tokens,
    };
  }

  async logout(request: any = null): Promise<boolean> {
    if (!request || !request?.user) {
      return false;
    }
    try {
      await this.destroySession(request?.user, request);
    } catch {
      throw new UnauthorizedException('Session does not exist!');
    }
    return true;
  }

  async register(authDto: AuthDto, request: any = null): Promise<MixinDto> {
    const authExists = await this.authGetByUsername(authDto.username);
    if (authExists) {
      throw new BadRequestException(
        'User with this username is already in the system',
      );
    }
    const salt = await genSalt(10);
    authDto.password = await hash(authDto.password, salt);
    const auth = await this.authCreate(authDto);
    const tokens = await this.createTokensPair(auth);
    if (request) {
      await this.createSession(auth, tokens, request);
    }
    return {
      ...auth,
      ...tokens,
    };
  }

  async refreshTokens(tokensDto: TokensDto, request: any): Promise<TokensDto> {
    const { refreshToken } = tokensDto;
    const sessionToken = request.session.token;
    if (!refreshToken || !sessionToken || refreshToken !== sessionToken) {
      throw new UnauthorizedException('Please sign in!');
    }
    let result;
    try {
      result = await this.jwtService.verifyAsync(refreshToken);
      if (!result) {
        throw new UnauthorizedException('Invalid token or expired!');
      }
    } catch {
      throw new UnauthorizedException('Invalid token or expired!');
    }
    const auth = await this.authGetOne(result.id);
    const tokens = await this.createTokensPair(auth);
    request.session.token = tokens.refreshToken;
    await this.refreshSession(auth, request);
    return tokens;
  }

  async createTokensPair(auth) {
    const data = { id: auth.id };
    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES'),
    });
    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES'),
    });
    return { accessToken, refreshToken };
  }

  async logSession(auth, request, description = '') {
    const { ip, method, originalUrl, headers } = request;
    const data = {
      ip,
      userAgent: headers['user-agent'],
      referrer: originalUrl,
      method,
      locale:
        headers['accept-language']?.split(',')?.[0]?.split(';')?.[0] || null,
      timezone: headers['timezone'],
      auth,
      description,
    };
    await this.sessionService.sessionCreate(data);
  }

  async createSession(auth, tokens, request) {
    const { refreshToken } = tokens;
    const { session } = request;
    if (!session) {
      return;
    }
    session.token = refreshToken;
    session.save(async (e) => {
      await this.logSession(auth, request, e ? 'create error' : 'create');
    });
  }

  async refreshSession(auth, request) {
    const { session } = request;
    if (!session) {
      return;
    }
    session.regenerate(async (e) => {
      await this.logSession(auth, request, e ? 'refresh error' : 'refresh');
    });
  }

  async destroySession(auth, request) {
    const { session } = request;
    if (session) {
      await session.destroy(async (e) => {
        await this.logSession(auth, request, e ? 'destroy error' : 'destroy');
      });
    }
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
