import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from '@src/clients/clients.controller';
import { ClientsEntity } from '@src/clients/clients.entity';
import { ClientsService } from '@src/clients/clients.service';
import { ClientsResolver } from '@src/clients/clients.resolver';

@Module({
  controllers: [ClientsController],
  imports: [
    TypeOrmModule.forFeature([ClientsEntity]),
  ],
  providers: [ClientsService, ClientsResolver],
  exports: [ClientsService],
})
export class ClientsModule {}
