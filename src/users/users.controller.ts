import { Body, Controller, Get, Put, Delete, NotFoundException } from '@nestjs/common';
import { Auth, Self } from '@src/auth/auth.decorator';
import { UsersService } from '@src/users/users.service';
import { UsersDto } from '@src/users/users.dto';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { Data } from '@src/app.decorator';
import { CommonController } from '@src/common/common.controller';
import { UsersEntity } from '@src/users/users.entity';
import { UsersFilter } from '@src/users/users.filter';

@Controller('users')
export class UsersController extends CommonController(
  'users',
  UsersEntity,
  UsersDto,
)<
  UsersService,
  UsersEntity,
  UsersDto,
  UsersFilter
> {
  constructor(
    readonly service: UsersService,
  ) {
    super();
  }

  @Get('findbyauthid')
  @Auth()
  async findByAuthId(
    @Data('authId') authId: number,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.service.findByAuthId(authId, relationsDto);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('findself')
  @Auth()
  async findSelf(
    @Self() id: number,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.service.findByAuthId(id, relationsDto);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Put('updatebyauthid')
  @Auth()
  async updateByAuthId(@Body() usersDto: UsersDto) {
    return await this.service.updateByAuthId(usersDto);
  }

  @Put('updateself')
  @Auth()
  async updateSelf(@Self() id: number, @Body() usersDto: UsersDto) {
    const user = await this.service.findByAuthId(id);
    if (!user) {
      throw new NotFoundException('Entry not found');
    }
    return await this.service.updateByAuthId(usersDto);
  }

  @Delete('removebyauthid')
  @Auth()
  async usersRemoveByAuthId(@Body() authId: number) {
    return await this.service.removeByAuthId(authId);
  }

  @Delete('removeself')
  @Auth()
  async usersRemoveSelf(@Self() id: number) {
    return await this.service.removeByAuthId(id);
  }
}
