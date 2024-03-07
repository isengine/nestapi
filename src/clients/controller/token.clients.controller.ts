import { Body, Controller, Post, Res } from '@nestjs/common';
import { TokenClientsDto } from '@src/clients/dto/token.clients.dto';
import { TokenClientsService } from '@src/clients/service/token.clients.service';

@Controller('clients')
export class TokenClientsController {
  constructor(
    private readonly tokenClientsService: TokenClientsService,
  ) {}

  @Post('token')
  async clientsTokenPassword(
    @Body() tokenClientsDto: TokenClientsDto,
    @Res({ passthrough: true }) response: any = undefined,
  ): Promise<any> {
    if (tokenClientsDto.grant_type === 'password') {
      // /token
      // grant_type=password
      // username=johndoe
      // password=A3ddj3w
      return await this.tokenClientsService.clientsTokenPassword(tokenClientsDto);
    }
    if (tokenClientsDto.grant_type === 'refresh_token') {
      // /token
      // grant_type=refresh_token
      // refresh_token=tGzv3JOkF0XG5Qx2TlKWIA
      // client_id=s6BhdRkqt3
      // client_secret=7Fjfp0ZBr1KtDRbnfVdmIw
      return await this.tokenClientsService.clientsTokenRefreshToken(tokenClientsDto);
    }
    if (tokenClientsDto.grant_type === 'client_credentials') {
      // /token
      // grant_type=client_credentials
      return await this.tokenClientsService.clientsTokenClientCredentials(tokenClientsDto);
    }
    if (tokenClientsDto.grant_type === 'authorization_code') {
      // /token
      // grant_type=authorization_code
      // code=SplxlOBeZQQYbYS6WxSbIA
      // client_id=s6BhdRkqt3
      // redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
      const result = await this.tokenClientsService.clientsTokenAuthorizationCode(tokenClientsDto);
      const args = [];
      Object.entries(result)?.forEach(([key, value]) => {
        args.push(`${key}=${value}`);
      });
      const url = `${tokenClientsDto.redirect_uri}?${args.join('&')}`;
      return response.redirect(url);
    }
  }
}
