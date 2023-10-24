export const relationsCreate = (query, relations, root) => {
  relations?.forEach((relation) => {
    const firstRelation =
      relation.indexOf('.') < 0 ? `${root}.${relation}` : relation;
    // const secondRelation = relation.split('.').pop();
    const secondRelation = relation.replaceAll('.', '_');
    // console.log('>', firstRelation, secondRelation);
    query.leftJoinAndSelect(firstRelation, secondRelation);
  });
};
