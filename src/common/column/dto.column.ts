import { Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { DeepPartial } from 'typeorm';

export function DtoColumn(description, options = undefined): PropertyDecorator {
  const { required = false, defaultValue = undefined } = options || {};

  return function (object: object, propertyName: string) {
    const properties: DeepPartial<any> = {
      description,
      required,
    };

    const params: DeepPartial<any> = {
      nullable: true,
    };

    if (defaultValue !== undefined) {
      properties.default = defaultValue;
      params.defaultValue = defaultValue;
    }

    ApiProperty(properties)(object, propertyName);
    Field(params)(object, propertyName);
  };
}
