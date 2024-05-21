import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthEntity } from '@src/auth/auth.entity';
import { AuthFilter } from '@src/auth/auth.filter';
import { CommonService } from '@src/common/common.service';
import { RelationsDto } from '@src/common/dto/relations.dto';

import { ConfirmAuthService } from '@src/auth/service/confirm.auth.service';
import { CreateAuthService } from '@src/auth/service/create.auth.service';
import { FindByUsernameAuthService } from '@src/auth/service/find_by_username.auth.service';
import { LoginAuthService } from '@src/auth/service/login.auth.service';
import { LogoutAuthService } from '@src/auth/service/logout.auth.service';
import { RegisterAuthService } from '@src/auth/service/register.auth.service';
import { RestoreAuthService } from '@src/auth/service/restore.auth.service';
import { RestorePrepareAuthService } from '@src/auth/service/restore_prepare.auth.service';

@Injectable()
export class AuthService extends CommonService<
  AuthEntity,
  AuthDto,
  AuthFilter
> {
  constructor(
    @InjectRepository(AuthEntity)
    protected readonly repository: Repository<AuthEntity>,

    protected readonly confirmAuthService: ConfirmAuthService,
    protected readonly createAuthService: CreateAuthService,
    protected readonly findByUsernameAuthService: FindByUsernameAuthService,
    protected readonly loginAuthService: LoginAuthService,
    protected readonly logoutAuthService: LogoutAuthService,
    protected readonly registerAuthService: RegisterAuthService,
    protected readonly restoreAuthService: RestoreAuthService,
    protected readonly restorePrepareAuthService: RestorePrepareAuthService,
  ) {
    super();
  }

  async confirm(code: string): Promise<boolean> {
    return await this.confirmAuthService.confirm(code);
  }

  async create(authDto: AuthDto, relationsDto: Array<RelationsDto> = undefined): Promise<AuthEntity> {
    return await this.createAuthService.create(authDto, relationsDto);
  }

  async findByUsername(username: string): Promise<AuthEntity> {
    return await this.findByUsernameAuthService.findByUsername(username);
  }

  async login(authDto: AuthDto, request: any = null): Promise<AuthEntity> {
    return await this.loginAuthService.login(authDto, request);
  }

  async logout(request: any = null): Promise<boolean> {
    return await this.logoutAuthService.logout(request);
  }

  async register(authDto: AuthDto): Promise<AuthEntity> {
    return await this.registerAuthService.register(authDto);
  }

  async restore(authDto: AuthDto, code: string): Promise<boolean> {
    return await this.restoreAuthService.restore(authDto, code);
  }

  async restorePrepare(authDto: AuthDto): Promise<boolean> {
    return await this.restorePrepareAuthService.restorePrepare(authDto);
  }
}
