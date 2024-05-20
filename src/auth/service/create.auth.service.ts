import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthEntity } from '@src/auth/auth.entity';
import { AuthFilter } from '@src/auth/auth.filter';
import { UsersService } from '@src/users/users.service';
import { CommonService } from '@src/common/common.service';
import { RelationsDto } from '@src/common/dto/relations.dto';

@Injectable()
export class CreateAuthService extends CommonService<
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
}
