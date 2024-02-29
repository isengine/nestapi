import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { TokensService } from '@src/tokens/tokens.service';
import { TokensDto } from '@src/tokens/tokens.dto';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @HttpCode(200)
  @Post('refresh_tokens')
  async tokensRefresh(@Body() tokensDto: TokensDto, @Req() req: any) {
    return this.tokensService.tokensRefresh(tokensDto, req);
  }
}
