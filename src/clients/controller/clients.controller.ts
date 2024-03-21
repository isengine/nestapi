import { Body, Controller, Get, Post, NotFoundException, Query } from '@nestjs/common';
import { ClientsService } from '@src/clients/service/clients.service';
import { ClientsDto } from '@src/clients/dto/clients.dto';
import { Client, SelfClient } from '@src/clients/clients.decorator';
import { Auth } from '@src/auth/auth.decorator';
import { CommonController } from '@src/common/common.controller';
import { ClientsEntity } from '../clients.entity';
import { ClientsFilter } from '../clients.filter';

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
  async register(@Body() clientsDto: ClientsDto) {
    return await this.service.register(clientsDto);
  }

  @Get('token')
  async clientsTokenGet(@Query() query) {
    return {
      title: 'redirect verify',
      query,
    };
  }

  @Client()
  @Get('self')
  async clientsSelfGet(@SelfClient() id: number) {
    const result = await this.service.findOne(id);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Client()
  @Post('self')
  async clientsSelfPost(@SelfClient() id: number) {
    const result = await this.service.findOne(id);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }
}
