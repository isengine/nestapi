import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthEntity } from '@src/auth/auth.entity';
import { AuthFilter } from '@src/auth/auth.filter';
import { CommonService } from '@src/common/common.service';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { UsersService } from '@src/users/users.service';
import { compare } from 'bcryptjs';

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
  ) {
    super();
  }

  async create(authDto: AuthDto, relationsDto: Array<RelationsDto> = undefined): Promise<AuthEntity> {
    const result = await super.create(authDto, relationsDto);
    await this.userService.create(
      {
        email: result.username,
      },
      null,
      result.id,
    );
    return result;
  }

  async findByUsername(username: string): Promise<AuthEntity> {
    return await this.repository.findOneBy({ username });
  }

  async login(authDto: AuthDto): Promise<AuthEntity> {
    const auth = await this.findByUsername(authDto.username);
    if (!auth) {
      throw new UnauthorizedException('User not found');
    }
    const isValidPassword = await compare(authDto.password, auth.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }
    return auth;
  }
}
