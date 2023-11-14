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
import { EventsDto } from '@src/events/events.dto';
import { EventsEntity } from '@src/events/events.entity';
import { EventsService } from '@src/events/events.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly eventsService: EventsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  async handleEvent(
    @MessageBody() eventsDto: EventsDto,
    @Req() client: Socket,
  ): Promise<EventsEntity> {
    const result = await this.eventsService.eventsCreate(eventsDto);
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
