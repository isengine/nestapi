import { Controller, Get, Post, NotFoundException, Query } from '@nestjs/common';
import { ClientsService } from '@src/clients/clients.service';
import { ClientsDto } from '@src/clients/clients.dto';
import { Client, SelfClient } from '@src/clients/clients.decorator';
import { PrivateController } from '@src/common/controller/private.controller';
import { ClientsEntity } from '@src/clients/clients.entity';
import { ClientsFilter } from '@src/clients/clients.filter';
import { ApiOperation, ApiExtraModels, ApiBody, ApiParam, ApiQuery, ApiResponse, getSchemaPath, ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('clients')
export class ClientsController extends PrivateController(
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
  async clientsSelf(@SelfClient() client: ClientsDto) {
    const { id } = client;
    const result = await this.service.findOne(id);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }
}
