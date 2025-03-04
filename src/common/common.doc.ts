import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiQuery,
  getSchemaPath,
  ApiResponse,
  ApiTags,
  ApiExtraModels,
} from '@nestjs/swagger';
import { RelationsDto } from '@src/common/dto/relations.dto';

export const CommonDoc = ({
  title,
  models = undefined,
  success = undefined,
  relations = false,
  queries = undefined,
  params = undefined,
}) => {
  const decorators = [];

  decorators.push(ApiOperation({ summary: title }));

  if (queries) {
    queries.forEach((query) => {
      if (query.required === undefined) {
        query.required = false;
      }
      if (!query.required) {
        query.type = `${query.type || ''}${
          query.type ? ', ' : ''
        }необязательный`;
      }
      if (query.example) {
        query.example = JSON.stringify(query.example);
      }
      decorators.push(ApiQuery(query));
    });
  }

  if (params) {
    params.reverse().forEach((param) => {
      if (!param.required) {
        param.required = false;
      }
      if (!param.required) {
        param.type = `${param.type ? `${param.type}, ` : ''}необязательный`;
      }
      if (param.example) {
        param.example = JSON.stringify(param.example);
      }
      decorators.push(ApiParam(param));
    });
  }

  if (relations) {
    if (!models?.length) {
      models = [];
    }
    models.push(RelationsDto);
  }

  if (models?.length) {
    decorators.push(ApiExtraModels(...models));

    const anyOf = [];
    models.forEach((model) => {
      anyOf.push({ $ref: getSchemaPath(model) });
    });
    decorators.push(ApiBody({ schema: { anyOf } }));
  }

  decorators.push(
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Выполнено',
      type: success,
    }),
  );

  decorators.push(
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Ошибка',
    }),
  );

  return applyDecorators(...decorators);
};
