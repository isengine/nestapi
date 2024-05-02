import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiExtraModels, ApiBody, ApiParam, ApiQuery, ApiResponse, getSchemaPath, ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { GrantsTokenService } from '@src/token/service/grants.service';
import { GrantsTokenDto } from '@src/token/dto/grants.dto';
import axios from 'axios';

@ApiTags('Токены')
@Controller('token')
export class TokenController {
  constructor(
    private readonly grantsTokenService: GrantsTokenService,
  ) {}
  @Post('/')
  @ApiOperation({ summary: 'Базовый метод получения токена' })
  @ApiQuery({
    name: 'grantsTokenDto',
    required: true,
    description: 'Объект полей запроса токена',
    type: '[GrantsTokenDto], обязательный',
    example: JSON.stringify([{ grant_type: 'authorization_code', client_id: '...', redirect_uri: '...' }]),
  })
  @ApiExtraModels(GrantsTokenDto)
  @ApiBody({ schema: { anyOf: [
    { $ref: getSchemaPath(GrantsTokenDto) },
  ] } })
  @ApiResponse({ status: HttpStatus.OK, description: 'Выполнено' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Ошибка' })
  async token(
    @Body() grantsTokenDto: GrantsTokenDto,
    @Res({ passthrough: true }) response: any = undefined,
  ): Promise<any> {
    // /token
    // grant_type=password
    // username=johndoe
    // password=A3ddj3w
    if (grantsTokenDto.grant_type === 'password') {
      return await this.grantsTokenService.grantsTokenPassword(grantsTokenDto);
    }
    // /token
    // grant_type=refresh_token
    // refresh_token=tGzv3JOkF0XG5Qx2TlKWIA
    // client_id=s6BhdRkqt3
    // client_secret=7Fjfp0ZBr1KtDRbnfVdmIw
    if (grantsTokenDto.grant_type === 'refresh_token') {
      return await this.grantsTokenService.grantsTokenRefreshToken(grantsTokenDto);
    }
    // /token
    // grant_type=client_credentials
    if (grantsTokenDto.grant_type === 'client_credentials') {
      return await this.grantsTokenService.grantsTokenClientCredentials(grantsTokenDto);
    }
    // /token
    // grant_type=authorization_code
    // code=SplxlOBeZQQYbYS6WxSbIA
    // client_id=s6BhdRkqt3
    // redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
    if (grantsTokenDto.grant_type === 'authorization_code') {
      return await this.grantsTokenService.grantsTokenAuthorizationCode(grantsTokenDto);
      // const result = await this.grantsTokenService.grantsTokenAuthorizationCode(grantsTokenDto);
      // const args = [];
      // Object.entries(result)?.forEach(([key, value]) => {
      //   args.push(`${key}=${encodeURIComponent(`${value}`)}`);
      // });
      // const url = `${grantsTokenDto.redirect_uri}?${args.join('&')}`;
      // return response.redirect(url);
    }
  }
}
