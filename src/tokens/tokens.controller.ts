// import { Body, Controller, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { Body, Controller, Get, HttpCode, Post, Req, NotFoundException } from '@nestjs/common';
import { TokensService } from '@src/tokens/tokens.service';
import { TokensDto } from '@src/tokens/tokens.dto';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import { Data } from '@src/app.decorator';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @HttpCode(200)
  @Post('refresh_tokens')
  async tokensRefresh(@Body() tokensDto: TokensDto, @Req() req: any) {
    return this.tokensService.tokensRefresh(tokensDto, req);
  }

  @Get('get_all')
  async tokensGetAll(@Data('relations') relationsDto: Array<RelationsDto>) {
    return await this.tokensService.tokensGetAll(relationsDto);
  }

  @Get('get_one')
  async tokensGetOne(
    @Data('id') id: number,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.tokensService.tokensGetOne(id, relationsDto);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_many')
  async tokensGetMany(
    @Data('ids') ids: Array<number | string>,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.tokensService.tokensGetMany(ids, relationsDto);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('filter')
  async tokensFilter(
    @Data('filter') tokensDto: TokensDto,
    @Data('options') optionsDto: OptionsDto,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.tokensService.tokensFilter(
      tokensDto,
      optionsDto,
      relationsDto,
    );
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('search')
  async tokensSearch(
    @Data('search') searchDto: SearchDto,
    @Data('options') optionsDto: OptionsDto,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.tokensService.tokensSearch(
      searchDto,
      optionsDto,
      relationsDto,
    );
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Post('create')
  async tokensCreate(@Body() tokensDto: TokensDto) {
    return await this.tokensService.tokensCreate(tokensDto);
  }

  // @Put('update')
  @Post('update')
  async tokensUpdate(@Body() tokensDto: TokensDto) {
    return await this.tokensService.tokensUpdate(tokensDto);
  }

  // @Delete('remove')
  @Post('remove')
  async tokensRemove(@Body('id') id: number) {
    return await this.tokensService.tokensRemove(id);
  }

  // @Delete('remove')
  @Post('remove_by_token')
  async tokensRemoveByToken(@Body('refreshToken') refreshToken: string) {
    return await this.tokensService.tokensRemoveByToken(refreshToken);
  }

  // @Delete('remove')
  @Post('remove_by_auth_id')
  async tokensRemoveByAuthId(@Body('id') id: number) {
    return await this.tokensService.tokensRemoveByAuthId(id);
  }
}
