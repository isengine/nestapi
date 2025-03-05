import { Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { DeepPartial } from 'typeorm';

export function DtoEnumColumn(
  description,
  value,
  defaultValue = undefined,
  options = undefined,
): PropertyDecorator {
  const { required = false } = options || {};

  return function (object: object, propertyName: string) {
    const properties: DeepPartial<any> = {
      description,
      required,
      enum: value,
    };

    const params: DeepPartial<any> = {
      nullable: true,
    };

    if (defaultValue !== undefined) {
      properties.default = defaultValue;
      params.defaultValue = defaultValue;
    }

    ApiProperty(properties)(object, propertyName);
    Field(() => value, params)(object, propertyName);
    IsEnum(value);
  };
}
