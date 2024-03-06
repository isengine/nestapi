import { RelationsDto } from '@src/typeorm/dto/relations.dto';

export const commonEntityGetParams = (dto) => {
  const fields = {};
  const { name } = dto;
  const core = dto?.dataSource?.options?.type;

  let root;
  const entity = dto?.dataSource?.entityMetadatas;
  entity.forEach((i) => {
    if (i.name === name) {
      root = i.tableName;
    }
    i?.columns?.forEach((c) => {
      const tableName = c.entityMetadata?.tableName;
      const key = `${tableName ? `${tableName}.` : ''}${c.propertyName}`;
      fields[key] = c.databaseName;
    });
  });

  return { root, core, fields };
};

export const commonRelationsCreate = (
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
