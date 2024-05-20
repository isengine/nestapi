import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GrantsDto } from '@src/grants/grants.dto';
import { CommonDoc } from '@src/common/common.doc';
import { GrantsService } from '@src/grants/grants.service';

@ApiTags('Токены')
@Controller('token')
export class TokenController {
  constructor(
    private readonly grantsService: GrantsService,
  ) {}

  @Post('/')
  @CommonDoc({
    title: 'Базовый метод получения токена',
    models: [GrantsDto],
    queries: [{
      name: 'grantsDto',
      required: true,
      description: 'Объект полей запроса токена',
      type: '[GrantsDto]',
      example: [{ grant_type: 'authorization_code', client_id: '...', redirect_uri: '...' }],
    }],
  })
  async token(
    @Body() grantsDto: GrantsDto,
    @Res({ passthrough: true }) response: any = undefined,
  ): Promise<any> {
    // /token
    // grant_type=authorization_code
    // code=SplxlOBeZQQYbYS6WxSbIA
    // client_id=s6BhdRkqt3
    // redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
    if (grantsDto.grant_type === 'authorization_code') {
      return await this.grantsService.authorizationCode(grantsDto);
    }
    // /token
    // grant_type=client_credentials
    // client_id=s6BhdRkqt3
    // client_secret=7Fjfp0ZBr1KtDRbnfVdmIw
    if (grantsDto.grant_type === 'client_credentials') {
      return await this.grantsService.clientCredentials(grantsDto);
    }
    // /token
    // grant_type=password
    // username=johndoe
    // password=A3ddj3w
    if (grantsDto.grant_type === 'password') {
      return await this.grantsService.password(grantsDto);
    }
    // /token
    // grant_type=person_credentials
    // username=johndoe
    // password=A3ddj3w
    if (grantsDto.grant_type === 'person_credentials') {
      return await this.grantsService.personCredentials(grantsDto);
    }
    // /token
    // grant_type=refresh_token
    // refresh_token=tGzv3JOkF0XG5Qx2TlKWIA
    if (grantsDto.grant_type === 'refresh_token') {
      return await this.grantsService.refreshToken(grantsDto);
    }
  }
}
