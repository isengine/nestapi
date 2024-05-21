import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '@src/clients/clients.module';
import { ClientsRedirectsEntity } from '@src/clients_redirects/clients_redirects.entity';
import { ClientsRedirectsService } from '@src/clients_redirects/clients_redirects.service';

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
