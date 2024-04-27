import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { ProtectedDto } from '@src/common/dto/protected.dto';
import { ProtectedEntity } from '@src/common/entity/protected.entity';
import { CommonService } from '@src/common/common.service';

export class ProtectedService<
  Entity extends ProtectedEntity,
  Dto extends ProtectedDto,
  Filter
> extends CommonService<
  Entity,
  Dto,
  Filter
> {
  protected readonly repository: Repository<Entity>;

  async findOne(
    id: number,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<Entity> {
    const where: FindOptionsWhere<any> = { id };
    return await this.repository.findOne({
      relations: relationsDto?.map(i => i.name),
      where,
    });
  }

  async create(
    dto: Dto,
    relationsDto: Array<RelationsDto> = undefined,
    authId: number,
  ): Promise<Entity> {
    delete dto.createdAt;
    delete dto.updatedAt;
    const auth = { id: authId };
    const entry: DeepPartial<any> = { ...dto, auth };
    if (entry.id) {
      entry.id = `${entry.id}`;
    }
    const created = await this.repository.save(entry);
    return await this.findOne(created.id, relationsDto);
  }

  async update(
    id: number,
    dto: Dto,
    relationsDto: Array<RelationsDto> = undefined,
    authId: number,
  ): Promise<Entity> {
    if (id === undefined) {
      return;
    }

    const auth = { id: authId };
    const where: FindOptionsWhere<any> = { id, auth };
    const find = await this.repository.findOne({
      where,
    });
    if (!find) {
      return;
    }

    dto.id = id;
    const entry: DeepPartial<any> = { ...dto };
    if (entry.id) {
      entry.id = `${entry.id}`;
    }
    const created = await this.repository.save(entry);
    return await this.findOne(created.id, relationsDto);
  }

  async remove(id: number, authId: number): Promise<boolean> {
    const where: FindOptionsWhere<any> = {
      id,
      auth: {
        id: authId,
      },
    };
    const result = await this.repository.delete(where);
    return !!result?.affected;
  }
}
