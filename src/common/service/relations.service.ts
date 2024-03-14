import { RelationsDto } from '@src/common/dto/relations.dto';

export const relationsCreate = (
  query,
  relationsDto: Array<RelationsDto>,
  root
) => {
  relationsDto?.forEach((relation) => {
    if (!relation) {
      return;
    }
    const firstRelation = relation.name?.indexOf('.') < 0 ? `${root}.${relation.name}` : relation.name;
    const secondRelation = relation.name?.replace(/\./giu, '_');
    query.leftJoinAndSelect(firstRelation, secondRelation);
  });
};
