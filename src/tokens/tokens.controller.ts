import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { TokensService } from '@src/tokens/tokens.service';
import { TokensDto } from '@src/tokens/tokens.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Токены')
@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @HttpCode(200)
  @Post('refresh_tokens')
  // где-то здесь сидит баз
  // @ApiOperation({ summary: 'Auth self get' })
  // @ApiParam({ name: 'id', required: true, description: 'Note identifier' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: 'Type' })
  // @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async tokensRefresh(@Body() tokensDto: TokensDto, @Req() req: any) {
    return this.tokensService.tokensRefresh(tokensDto.refresh_token, req);
  }
  
}
