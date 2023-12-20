// import { Body, Controller, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { Self } from '@src/users/users.decorator';
import { Auth } from '@src/auth/decorator/auth.decorator';
import { UsersService } from '@src/users/users.service';
import { UsersDto } from '@src/users/users.dto';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('get_all')
  @Auth('admin')
  async usersGetAll() {
    return await this.usersService.usersGetAll();
  }

  @Get('get_one')
  @Auth()
  async usersGetOne(@Body('id') id: number) {
    const result = await this.usersService.usersGetOne(id);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_many')
  @Auth()
  async usersGetMany(@Body('ids') ids: Array<number | string>) {
    const result = await this.usersService.usersGetMany(ids);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_by_auth_id')
  @Auth()
  async usersGetByAuthId(@Body() usersDto: UsersDto) {
    const { authId } = usersDto;
    const result = await this.usersService.usersGetByAuthId(authId);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_self')
  @Auth()
  async usersGetSelf(@Self() id: number) {
    const result = await this.usersService.usersGetByAuthId(id);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('filter')
  async usersFilter(
    @Body('filter') usersDto: UsersDto,
    @Body('options') optionsDto: OptionsDto,
  ) {
    const result = await this.usersService.usersFilter(usersDto, optionsDto);
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('search')
  async usersSearch(
    @Body('search') searchDto: SearchDto,
    @Body('options') optionsDto: OptionsDto,
  ) {
    const result = await this.usersService.usersSearch(searchDto, optionsDto);
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Post('create')
  @Auth('admin')
  async usersCreate(@Body() usersDto: UsersDto) {
    return await this.usersService.usersCreate(usersDto);
  }

  // @Put('update')
  @Post('update')
  @Auth('admin')
  async usersUpdate(@Body() usersDto: UsersDto) {
    return await this.usersService.usersUpdate(usersDto);
  }

  // @Put('update_by_auth_id')
  @Post('update_by_auth_id')
  @Auth('admin')
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
  @Auth('admin')
  async usersRemove(@Body() id: number) {
    return await this.usersService.usersRemove(id);
  }

  // @Delete('remove_by_auth_id')
  @Post('remove_by_auth_id')
  @Auth('admin')
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
