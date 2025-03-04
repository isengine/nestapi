import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '../clients.module';
import { ClientsRedirectsEntity } from './clients_redirects.entity';
import { ClientsRedirectsService } from './clients_redirects.service';

@Module({
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([ClientsRedirectsEntity]),
    forwardRef(() => ClientsModule),
  ],
  providers: [ClientsRedirectsService],
  exports: [ClientsRedirectsService],
})
export class ClientsRedirectsModule {}
