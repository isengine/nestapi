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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(authDto: AuthDto): Promise<MixinDto> {
    const auth = await this.authGetByLogin(authDto.login);
    if (!auth) {
      throw new UnauthorizedException('User not found');
    }
    const isValidPassword = await compare(authDto.password, auth.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }
    const tokens = await this.createTokensPair(auth);
    return {
      ...auth,
      ...tokens,
    };
  }

  async register(authDto: AuthDto): Promise<MixinDto> {
    const authExists = await this.authGetByLogin(authDto.login);
    if (authExists) {
      throw new BadRequestException(
        'User with this login is already in the system',
      );
    }
    const salt = await genSalt(10);
    authDto.password = await hash(authDto.password, salt);
    const auth = await this.authCreate(authDto);
    const tokens = await this.createTokensPair(auth);
    return {
      ...auth,
      ...tokens,
    };
  }

  async refreshTokens(tokensDto: TokensDto) {
    const { refreshToken } = tokensDto;
    if (!refreshToken) {
      throw new UnauthorizedException('Please sign in!');
    }
    const result = await this.jwtService.verifyAsync(refreshToken);
    if (!result) {
      throw new UnauthorizedException('Invalid token or expired!');
    }
    const auth = await this.authGetOne(result.id);
    const tokens = await this.createTokensPair(auth);
    return {
      ...auth,
      ...tokens,
    };
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

  async authGetAll(): Promise<AuthEntity[]> {
    return await this.authRepository.find();
  }

  async authGetOne(id: number): Promise<AuthEntity> {
    return await this.authRepository.findOneBy({ id });
  }

  async authGetByLogin(login: string): Promise<AuthEntity> {
    return await this.authRepository.findOneBy({ login });
  }

  async authCreate(authDto: AuthDto): Promise<AuthEntity> {
    return await this.authRepository
      .save({ ...authDto })
      .then(async (result) => {
        await this.userService.usersCreate({
          email: result.login,
          auth: {
            id: result.id,
            login: result.login,
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
    await this.authCreate(authDto);
    return await this.authGetOne(authDto.id);
  }

  async authRemove(id: number): Promise<boolean> {
    const result = await this.authRepository.delete({ id });
    return !!result?.affected;
  }
}
