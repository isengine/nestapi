import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { genSalt, hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthEntity } from '@src/auth/auth.entity';
import { AuthFilter } from '@src/auth/auth.filter';
import { AuthConfirmService } from '@src/auth_confirm/auth_confirm.service';
import { CommonService } from '@src/common/common.service';

@Injectable()
export class RestoreAuthService extends CommonService<
  AuthEntity,
  AuthDto,
  AuthFilter
> {
  constructor(
    @InjectRepository(AuthEntity)
    protected readonly repository: Repository<AuthEntity>,
    protected readonly authConfirmService: AuthConfirmService,
  ) {
    super();
  }

  async restore(authDto: AuthDto, code: string): Promise<boolean> {
    const confirm = await this.authConfirmService.validate(code, 'restore');
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
}
