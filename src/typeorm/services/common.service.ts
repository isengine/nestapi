export const commonEntityGetParams = (dto) => {
  const { name } = dto;
  const core = dto?.dataSource?.options?.type;

  let root;
  const entity = dto?.dataSource?.entityMetadatas;
  entity.forEach((i) => {
    if (i.name === name) {
      root = i.tableName;
    }
  });

  return { root, core };
};

export const commonRelationsCreate = (query, relations, root) => {
  relations?.forEach((relation) => {
    const firstRelation =
      relation.indexOf('.') < 0 ? `${root}.${relation}` : relation;
    // const secondRelation = relation.split('.').pop();
    const secondRelation = relation.replaceAll('.', '_');
    // console.log('>', firstRelation, secondRelation);
    query.leftJoinAndSelect(firstRelation, secondRelation);
  });
};
