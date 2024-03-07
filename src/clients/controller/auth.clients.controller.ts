import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthClientsDto } from '@src/clients/dto/auth.clients.dto';
import { AuthClientsService } from '@src/clients/service/auth.clients.service';
import { Client, SelfClient } from '@src/clients/clients.decorator';

@Controller('clients')
export class AuthClientsController {
  constructor(
    private readonly authClientsService: AuthClientsService,
  ) {}

  @Client()
  @Post('auth')
  async clientsAuthCode(
    @Body() authClientsDto: AuthClientsDto,
    @SelfClient() id: number,
    @Res() res: any,
  ) {
    let url = '';
    const result = await this.authClientsService.clientsAuthPrepare(authClientsDto, id);
    if (authClientsDto.response_type === 'code') {
      // response_type=code
      // client_id=s6BhdRkqt3
      // state=xyz
      // redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
      url = await this.authClientsService.clientsAuthCode(result, authClientsDto.state);
    }
    if (authClientsDto.response_type === 'token') {
      // response_type=token
      // client_id=s6BhdRkqt3
      // state=xyz
      // redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
      url = await this.authClientsService.clientsAuthToken(result, authClientsDto.state);
    }
    return await res.redirect(url);
  }
}
