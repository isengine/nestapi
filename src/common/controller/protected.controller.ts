import {
  Body,
  Delete,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Type,
} from '@nestjs/common';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { CommonService } from '@src/common/common.service';
import { ProtectedDto } from '@src/common/dto/protected.dto';
import { ProtectedEntity } from '@src/common/entity/protected.entity';
import { CommonController } from '@src/common/common.controller';
import { AuthDto } from '@src/auth/auth.dto';
import { Auth, Self } from '@src/auth/auth.decorator';
import { Doc } from '@src/common/common.decorator';

export const ProtectedController = <T extends Type<unknown>>(
  name: string,
  classEntity: T,
  classDto,
) => {
  class BaseProtectedController<
    Service extends CommonService<Entity, Dto, Filter>,
    Entity extends ProtectedEntity,
    Dto extends ProtectedDto,
    Filter
  > extends CommonController(
    name,
    classEntity,
    classDto,
  )<
    Service,
    Entity,
    Dto,
    Filter
  > {
    readonly service: Service;

    @Auth()
    @Post('create')
    @Doc('create', classDto)
    async create(
      @Body('create') dto: Dto,
      @Body('relations') relationsDto: Array<RelationsDto>,
      @Self() auth: AuthDto,
    ): Promise<Entity> {
      const authId = auth.id;
      return await this.service.create(dto, relationsDto, authId);
    }

    @Auth()
    @Patch('update/:id')
    @Doc('update', classDto)
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body('update') dto: Dto,
      @Body('relations') relationsDto: Array<RelationsDto>,
      @Self() auth: AuthDto,
    ): Promise<Entity> {
      const authId = auth.isSuperuser ? undefined : auth.id;
      const result = await this.service.update(Number(id), dto, relationsDto, authId);
      if (!result) {
        throw new NotFoundException('Entry not found');
      }
      return result;
    }

    @Auth()
    @Delete('remove/:id')
    @Doc('remove', undefined)
    async remove(
      @Param('id', ParseIntPipe) id: number,
      @Self() auth: AuthDto,
    ): Promise<boolean> {
      const authId = auth.isSuperuser ? undefined : auth.id;
      return await this.service.remove(id, authId);
    }
  }
  return BaseProtectedController;
}
