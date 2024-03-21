import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '@src/clients/clients.module';
import { RedirectsEntity } from '@src/redirects/redirects.entity';
import { RedirectsService } from '@src/redirects/redirects.service';

@Module({
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([RedirectsEntity]),
    forwardRef(() => ClientsModule),
  ],
  providers: [RedirectsService],
  exports: [RedirectsService],
})
export class RedirectsModule {}
