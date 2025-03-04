import {
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Req } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { SocketsDto } from './sockets.dto';
import { SocketsEntity } from './sockets.entity';
import { SocketsService } from './sockets.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly socketsService: SocketsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sockets')
  async handleEvent(
    @MessageBody() sockets: SocketsDto,
    @Req() client: Socket,
  ): Promise<SocketsEntity> {
    const result = await this.socketsService.create(sockets);
    this.server.emit('event', result);
    console.log('client', client.id);
    return result;
  }

  afterInit(server: Server) {
    console.log(`Server: ${server}`);
    //Выполняем действия
  }

  handleDisconnect(@Req() client: Socket) {
    console.log(`Disconnected: ${client.id}`);
    this.server.emit('disconnected', client.id);
    //Выполняем действия
  }

  handleConnection(@Req() client: Socket) {
    console.log(`Connected: ${client.id}`);
    this.server.emit('connected', client.id);
    //Выполняем действия
    /*
      handshake.headers
      handshake.query
      handshake.auth
      id
      adapter.rooms => client.nsp.adapter.rooms
      adapter.sids
    */
  }
}
