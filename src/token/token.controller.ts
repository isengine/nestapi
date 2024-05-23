import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommonDoc } from '@src/common/common.doc';
import { GrantsTokenDto } from '@src/token/dto/grants.token.dto';
import { GrantsTokenService } from '@src/token/service/grants.token.service';

@ApiTags('Токены')
@Controller('token')
export class TokenController {
  constructor(
    private readonly grantsTokenService: GrantsTokenService,
  ) {}

  @Post('/')
  @CommonDoc({
    title: 'Базовый метод получения токена',
    models: [GrantsTokenDto],
    queries: [{
      name: 'grantsTokenDto',
      required: true,
      description: 'Объект полей запроса токена',
      type: '[GrantsTokenDto]',
      example: [{ grant_type: 'authorization_code', client_id: '...', redirect_uri: '...' }],
    }],
  })
  async token(
    @Body() grantsTokenDto: GrantsTokenDto,
    @Res({ passthrough: true }) response: any = undefined,
  ): Promise<any> {
    // /token
    // grant_type=authorization_code
    // code=SplxlOBeZQQYbYS6WxSbIA
    // client_id=s6BhdRkqt3
    // redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
    if (grantsTokenDto.grant_type === 'authorization_code') {
      return await this.grantsTokenService.authorizationCode(grantsTokenDto);
    }
    // /token
    // grant_type=client_credentials
    // client_id=s6BhdRkqt3
    // client_secret=7Fjfp0ZBr1KtDRbnfVdmIw
    if (grantsTokenDto.grant_type === 'client_credentials') {
      return await this.grantsTokenService.clientCredentials(grantsTokenDto);
    }
    // /token
    // grant_type=password
    // username=johndoe
    // password=A3ddj3w
    if (grantsTokenDto.grant_type === 'password') {
      return await this.grantsTokenService.password(grantsTokenDto);
    }
    // /token
    // grant_type=person_credentials
    // username=johndoe
    // password=A3ddj3w
    if (grantsTokenDto.grant_type === 'person_credentials') {
      return await this.grantsTokenService.personCredentials(grantsTokenDto);
    }
    // /token
    // grant_type=refresh_token
    // refresh_token=tGzv3JOkF0XG5Qx2TlKWIA
    if (grantsTokenDto.grant_type === 'refresh_token') {
      return await this.grantsTokenService.refreshToken(grantsTokenDto);
    }
  }
}
