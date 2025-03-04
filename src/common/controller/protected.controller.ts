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
import { Data, Doc } from '@src/common/common.decorator';
import { CommonEntity } from '@src/common/common.entity';
import { CommonDto } from '@src/common/common.dto';
import { BindDto } from '../dto/bind.dto';

export const ProtectedController = <T extends Type<unknown>>(
  name: string,
  classDto,
  classEntity: T,
  authTable = '',
) => {
  class BaseProtectedController<
    Dto extends ProtectedDto | CommonDto,
    Entity extends ProtectedEntity | CommonEntity,
    Service extends CommonService<Dto, Entity>,
  > extends CommonController(name, classDto, classEntity)<
    Dto,
    Entity,
    Service
  > {
    readonly service: Service;

    @Auth()
    @Post('create')
    @Doc('create', classDto)
    async create(
      @Body('create') dto: Dto,
      @Body('relations') relations: Array<RelationsDto>,
      @Self() auth: AuthDto,
    ): Promise<Entity> {
      const bind: BindDto = this.service.bind(auth, {
        name: authTable,
        allow: auth?.isSuperuser,
      });
      return await this.service.create(dto, relations, bind);
    }

    @Auth()
    @Patch('update/:id')
    @Doc('update', classDto)
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body('update') dto: Dto,
      @Body('relations') relations: Array<RelationsDto>,
      @Self() auth: AuthDto,
    ): Promise<Entity> {
      const bind: BindDto = this.service.bind(auth, {
        name: authTable,
        allow: auth?.isSuperuser,
      });
      const result = await this.service.update(
        Number(id),
        dto,
        relations,
        bind,
      );
      if (!result) {
        throw new NotFoundException('Entrie not found');
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
      const bind: BindDto = this.service.bind(auth, {
        name: authTable,
        allow: auth?.isSuperuser,
      });
      return await this.service.remove(id, bind);
    }

    @Auth()
    @Post('position/sort')
    @Doc('sortPosition', classDto)
    async sortPosition(
      @Data('field') field: string,
      @Data('select') select: object,
      @Data('where') where: object,
      @Data('order') order: object,
      @Data('limit') limit: number = undefined,
      @Data('offset') offset: number = undefined,
      @Data('relations') relations: Array<RelationsDto>,
      @Self() auth: AuthDto,
    ): Promise<boolean> {
      const bind: BindDto = this.service.bind(auth, {
        name: authTable,
        allow: auth?.isSuperuser,
      });
      const result = await this.service.sortPosition(
        field,
        {
          select,
          where,
          order,
          limit,
          offset,
          relations,
        },
        bind,
      );
      if (!result) {
        throw new NotFoundException('Entries not found');
      }
      return result;
    }

    @Auth()
    @Post('position/move/:id')
    @Doc('movePosition', classDto)
    async movePosition(
      @Param('id', ParseIntPipe) id: number,
      @Data('field') field: string,
      @Data('position') position: number = undefined,
      @Self() auth: AuthDto,
    ): Promise<boolean> {
      const bind: BindDto = this.service.bind(auth, {
        name: authTable,
        allow: auth?.isSuperuser,
      });
      const result = await this.service.movePosition(id, field, position, bind);
      if (!result) {
        throw new NotFoundException('Entrie position has not been moved');
      }
      return result;
    }
  }
  return BaseProtectedController;
};
