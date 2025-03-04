export const removePrivateFields = async ({ result, repository }, bind) => {
  await Promise.all(
    result.map(
      (entrie) =>
        entrie &&
        processEntity(
          {
            entrie,
            metadata: repository.metadata,
          },
          bind,
        ),
    ),
  );
  return result;
};

const processEntity = async ({ entrie, metadata }, bind) => {
  if (!metadata.column || !Array.isArray(metadata.column)) {
    return;
  }

  for (const column of metadata.column) {
    const { propertyName } = column;
    const entityClass = metadata.target; // as Function;
    const metadataValue = Reflect.getMetadata(
      'customMetadata',
      entityClass.prototype,
      propertyName,
    );
    if (metadataValue === 'private') {
      const { allow, id, key, name } = bind;
      const equal = +entrie?.[name || 'auth']?.[key || 'id'] === +id;
      if (allow === false || !equal) {
        delete entrie[propertyName];
      }
    }
  }

  if (!metadata.relations || !Array.isArray(metadata.relations)) {
    return;
  }

  for (const relation of metadata.relations) {
    const relatedEntities = entrie[relation.propertyName];
    if (Array.isArray(relatedEntities)) {
      await Promise.all(
        relatedEntities.map(
          (relatedEntity) =>
            relatedEntity &&
            processEntity(
              {
                entrie: relatedEntity,
                metadata: relation.inverseEntityMetadata,
              },
              bind,
            ),
        ),
      );
    } else if (relatedEntities) {
      await processEntity(
        {
          entrie: relatedEntities,
          metadata: relation.inverseEntityMetadata,
        },
        bind,
      );
    }
  }
};
