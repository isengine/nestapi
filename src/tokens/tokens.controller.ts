import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiExtraModels, ApiBody, ApiParam, ApiQuery, ApiResponse, getSchemaPath, ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { TokensGrantsService } from '@src/tokens/service/tokens.grants.service';
import { TokensGrantsDto } from '@src/tokens/dto/tokens.grants.dto';

@ApiTags('Токены')
@Controller('tokens')
export class TokensController {
  constructor(
    private readonly tokensGrantsService: TokensGrantsService,
  ) {}
  @Post('/')
  @ApiOperation({ summary: 'Базовый метод получения токена' })
  @ApiQuery({
    name: 'tokensGrantsDto',
    required: true,
    description: 'Объект полей запроса токена',
    type: '[TokensGrantsDto], обязательный',
    example: JSON.stringify([{ grant_type: 'authorization_code', client_id: '...', redirect_uri: '...' }]),
  })
  @ApiExtraModels(TokensGrantsDto)
  @ApiBody({ schema: { anyOf: [
    { $ref: getSchemaPath(TokensGrantsDto) },
  ] } })
  @ApiResponse({ status: HttpStatus.OK, description: 'Выполнено' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Ошибка' })
  async token(
    @Body() tokensGrantsDto: TokensGrantsDto,
    @Res({ passthrough: true }) response: any = undefined,
  ): Promise<any> {
    // /tokens
    // grant_type=password
    // username=johndoe
    // password=A3ddj3w
    if (tokensGrantsDto.grant_type === 'password') {
      return await this.tokensGrantsService.tokensGrantsPassword(tokensGrantsDto);
    }
    // /tokens
    // grant_type=refresh_token
    // refresh_token=tGzv3JOkF0XG5Qx2TlKWIA
    // client_id=s6BhdRkqt3
    // client_secret=7Fjfp0ZBr1KtDRbnfVdmIw
    if (tokensGrantsDto.grant_type === 'refresh_token') {
      return await this.tokensGrantsService.tokensGrantsRefreshToken(tokensGrantsDto);
    }
    // /tokens
    // grant_type=client_credentials
    if (tokensGrantsDto.grant_type === 'client_credentials') {
      return await this.tokensGrantsService.tokensGrantsClientCredentials(tokensGrantsDto);
    }
    // /tokens
    // grant_type=authorization_code
    // code=SplxlOBeZQQYbYS6WxSbIA
    // client_id=s6BhdRkqt3
    // redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
    if (tokensGrantsDto.grant_type === 'authorization_code') {
      const result = await this.tokensGrantsService.tokensGrantsAuthorizationCode(tokensGrantsDto);
      const args = [];
      Object.entries(result)?.forEach(([key, value]) => {
        args.push(`${key}=${value}`);
      });
      const url = `${tokensGrantsDto.redirect_uri}?${args.join('&')}`;
      return response.redirect(url);
    }
  }
}
