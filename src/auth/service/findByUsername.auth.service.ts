import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthEntity } from '@src/auth/auth.entity';
import { AuthFilter } from '@src/auth/auth.filter';
import { CommonService } from '@src/common/common.service';

@Injectable()
export class FindByUsernameAuthService extends CommonService<
  AuthEntity,
  AuthDto,
  AuthFilter
> {
  constructor(
    @InjectRepository(AuthEntity)
    protected readonly repository: Repository<AuthEntity>,
  ) {
    super();
  }

  async findByUsername(username: string): Promise<AuthEntity> {
    return await this.repository.findOneBy({ username });
  }
}
