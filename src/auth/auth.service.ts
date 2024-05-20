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
import { FindByUsernameAuthService } from '@src/auth/service/findByUsername.auth.service';
import { LoginAuthService } from '@src/auth/service/login.auth.service';
import { LogoutAuthService } from '@src/auth/service/logout.auth.service';
import { RegisterAuthService } from '@src/auth/service/register.auth.service';
import { RestoreAuthService } from '@src/auth/service/restore.auth.service';
import { RestorePrepareAuthService } from '@src/auth/service/restorePrepare.auth.service';

import { OAuthDto } from '@src/auth/dto/oauth.dto';
import { ClientsDto } from '@src/clients/clients.dto';
import { ClientsEntity } from '@src/clients/clients.entity';
import { CodeAuthService } from '@src/auth/service/code.auth.service';
import { CodeGenerateAuthService } from '@src/auth/service/codeGenerate.auth.service';
import { CodeVerifyAuthService } from '@src/auth/service/codeVerify.auth.service';
import { TokenAuthService } from '@src/auth/service/token.auth.service';
import { VerifyAuthService } from '@src/auth/service/verify.auth.service';

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

    private readonly codeAuthService: CodeAuthService,
    private readonly codeGenerateAuthService: CodeGenerateAuthService,
    private readonly codeVerifyAuthService: CodeVerifyAuthService,
    private readonly tokenAuthService: TokenAuthService,
    private readonly verifyAuthService: VerifyAuthService,
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

  // oauth

  async code(clientsDto: ClientsDto, id: number, state: string): Promise<string> {
    return await this.codeAuthService.code(clientsDto, id, state);
  }

  async codeGenerate(clientsDto: ClientsDto, id: number): Promise<ClientsEntity> {
    return await this.codeGenerateAuthService.codeGenerate(clientsDto, id);
  }

  async codeVerify(code: string, clientsDto: ClientsDto): Promise<number> {
    return await this.codeVerifyAuthService.codeVerify(code, clientsDto);
  }

  async token(clientsDto: ClientsDto, id: number, state: string): Promise<string> {
    return await this.tokenAuthService.token(clientsDto, id, state);
  }

  async verify(oauthDto: OAuthDto): Promise<ClientsDto> {
    return await this.verifyAuthService.verify(oauthDto);
  }
}
