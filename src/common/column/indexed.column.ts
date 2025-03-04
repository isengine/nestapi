import { Index } from 'typeorm';

export function IndexedColumn(
  index = undefined,
): PropertyDecorator | undefined {
  if (index === 'unique') {
    return Index({
      unique: true,
    });
  }

  return Index();
}
