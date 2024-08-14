export const entityGetParams = (dto) => {
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
      if (!c) {
        return;
      }
      const tableName = c.entityMetadata?.tableName;
      const key = `${tableName ? `${tableName}.` : ''}${c.propertyName}`;
      fields[key] = c.databaseName;
    });
  });
  
  return { root, core, fields };
};
