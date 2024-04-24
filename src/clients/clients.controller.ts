import { Body, Controller, HttpStatus, Get, Post, NotFoundException, Query } from '@nestjs/common';
import { ClientsService } from '@src/clients/clients.service';
import { ClientsDto } from '@src/clients/clients.dto';
import { Client, SelfClient } from '@src/clients/clients.decorator';
import { Auth } from '@src/auth/auth.decorator';
import { CommonController } from '@src/common/common.controller';
import { ClientsEntity } from '@src/clients/clients.entity';
import { ClientsFilter } from '@src/clients/clients.filter';
import { ApiOperation, ApiExtraModels, ApiBody, ApiParam, ApiQuery, ApiResponse, getSchemaPath, ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('clients')
export class ClientsController extends CommonController(
  'Клиентские приложения',
  ClientsEntity,
  ClientsDto,
)<
  ClientsService,
  ClientsEntity,
  ClientsDto,
  ClientsFilter
> {
  constructor(
    readonly service: ClientsService,
  ) {
    super();
  }

  @Auth()
  @Post('register')
  @ApiOperation({ summary: 'Регистрация клиентского приложения' })
  @ApiQuery({
    name: 'clientsDto',
    required: true,
    description: 'Объект полей клиентского приложения',
    type: '[ClientsDto], обязательный',
    example: JSON.stringify([{ client_id: '...', title: '...' }]),
  })
  @ApiExtraModels(ClientsDto)
  @ApiBody({ schema: { anyOf: [
    { $ref: getSchemaPath(ClientsDto) },
  ] } })
  @ApiResponse({ status: HttpStatus.OK, description: 'Выполнено' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Ошибка' })
  async register(@Body() clientsDto: ClientsDto) {
    return await this.service.register(clientsDto);
  }

  @Get('token')
  @ApiExcludeEndpoint()
  async clientsTokenGet(@Query() query) {
    return {
      title: 'redirect verify',
      query,
    };
  }

  @Client()
  @Get('self')
  @ApiExcludeEndpoint()
  async clientsSelfGet(@SelfClient() id: number) {
    const result = await this.service.findOne(id);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Client()
  @Post('self')
  @ApiExcludeEndpoint()
  async clientsSelfPost(@SelfClient() id: number) {
    const result = await this.service.findOne(id);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }
}
