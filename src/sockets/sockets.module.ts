import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketsController } from '@src/sockets/sockets.controller';
import { SocketsEntity } from '@src/sockets/sockets.entity';
import { SocketsGateway } from '@src/sockets/sockets.gateway';
import { SocketsService } from '@src/sockets/sockets.service';
import { RoomsModule } from '@src/rooms/rooms.module';
import { AuthModule } from '@src/auth/auth.module';

@Module({
  controllers: [SocketsController],
  imports: [
    TypeOrmModule.forFeature([SocketsEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => RoomsModule),
  ],
  providers: [SocketsService, SocketsGateway],
  exports: [SocketsService],
})
export class SocketsModule {}
