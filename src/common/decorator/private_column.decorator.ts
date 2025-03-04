export function PrivateColumn() {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata('customMetadata', 'private', target, propertyKey);
  };
}
