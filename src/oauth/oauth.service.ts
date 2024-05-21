import { Injectable } from '@nestjs/common';
import { OAuthDto } from '@src/oauth/oauth.dto';
import { ClientsDto } from '@src/clients/clients.dto';
import { ClientsEntity } from '@src/clients/clients.entity';
import { CodeOAuthService } from '@src/oauth/service/code.oauth.service';
import { CodeGenerateOAuthService } from '@src/oauth/service/codeGenerate.oauth.service';
import { CodeVerifyOAuthService } from '@src/oauth/service/codeVerify.oauth.service';
import { TokenOAuthService } from '@src/oauth/service/token.oauth.service';
import { VerifyOAuthService } from '@src/oauth/service/verify.oauth.service';

@Injectable()
export class OAuthService {
  constructor(
    private readonly codeOAuthService: CodeOAuthService,
    private readonly codeGenerateOAuthService: CodeGenerateOAuthService,
    private readonly codeVerifyOAuthService: CodeVerifyOAuthService,
    private readonly tokenOAuthService: TokenOAuthService,
    private readonly verifyOAuthService: VerifyOAuthService,
  ) {}

  async code(clientsDto: ClientsDto, id: number, state: string): Promise<string> {
    return await this.codeOAuthService.code(clientsDto, id, state);
  }

  async codeGenerate(clientsDto: ClientsDto, id: number): Promise<ClientsEntity> {
    return await this.codeGenerateOAuthService.codeGenerate(clientsDto, id);
  }

  async codeVerify(code: string, clientsDto: ClientsDto): Promise<number> {
    return await this.codeVerifyOAuthService.codeVerify(code, clientsDto);
  }

  async token(clientsDto: ClientsDto, id: number, state: string): Promise<string> {
    return await this.tokenOAuthService.token(clientsDto, id, state);
  }

  async verify(oauthDto: OAuthDto): Promise<ClientsDto> {
    return await this.verifyOAuthService.verify(oauthDto);
  }
}
