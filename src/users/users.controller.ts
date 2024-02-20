// import { Body, Controller, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { Auth, Self } from '@src/auth/auth.decorator';
import { UsersService } from '@src/users/users.service';
import { UsersDto } from '@src/users/users.dto';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import { Data } from '@src/app.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('get_all')
  @Auth()
  async usersGetAll(@Data('relations') relationsDto: Array<RelationsDto>) {
    return await this.usersService.usersGetAll(relationsDto);
  }

  @Get('get_one')
  @Auth()
  async usersGetOne(
    @Data('id') id: number,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.usersService.usersGetOne(id, relationsDto);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_many')
  @Auth()
  async usersGetMany(
    @Data('ids') ids: Array<number | string>,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.usersService.usersGetMany(ids, relationsDto);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_by_auth_id')
  @Auth()
  async usersGetByAuthId(
    @Data('authId') authId: number,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.usersService.usersGetByAuthId(authId, relationsDto);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_self')
  @Auth()
  async usersGetSelf(
    @Self() id: number,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.usersService.usersGetByAuthId(id, relationsDto);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('filter')
  async usersFilter(
    @Data('filter') usersDto: UsersDto,
    @Data('options') optionsDto: OptionsDto,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.usersService.usersFilter(
      usersDto,
      optionsDto,
      relationsDto,
    );
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('search')
  async usersSearch(
    @Data('search') searchDto: SearchDto,
    @Data('options') optionsDto: OptionsDto,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.usersService.usersSearch(
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
  @Auth()
  async usersCreate(@Body() usersDto: UsersDto) {
    return await this.usersService.usersCreate(usersDto);
  }

  // @Put('update')
  @Post('update')
  @Auth()
  async usersUpdate(@Body() usersDto: UsersDto) {
    return await this.usersService.usersUpdate(usersDto);
  }

  // @Put('update_by_auth_id')
  @Post('update_by_auth_id')
  @Auth()
  async usersUpdateByAuthId(@Body() usersDto: UsersDto) {
    return await this.usersService.usersUpdateByAuthId(usersDto);
  }

  // @Put('update_self')
  @Post('update_self')
  @Auth()
  async usersUpdateSelf(@Self() id: number, @Body() usersDto: UsersDto) {
    const user = await this.usersService.usersGetByAuthId(id);
    if (!user) {
      throw new NotFoundException('Entry not found');
    }
    return await this.usersService.usersUpdateByAuthId(usersDto);
  }

  // @Delete('remove')
  @Post('remove')
  @Auth()
  async usersRemove(@Body() id: number) {
    return await this.usersService.usersRemove(id);
  }

  // @Delete('remove_by_auth_id')
  @Post('remove_by_auth_id')
  @Auth()
  async usersRemoveByAuthId(@Body() authId: number) {
    return await this.usersService.usersRemoveByAuthId(authId);
  }

  // @Delete('remove_self')
  @Post('remove_self')
  @Auth()
  async usersRemoveSelf(@Self() id: number) {
    return await this.usersService.usersRemoveByAuthId(id);
  }
}
