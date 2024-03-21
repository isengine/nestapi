import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthClientsController } from '@src/clients/controller/auth.clients.controller';
import { TokenClientsController } from '@src/clients/controller/token.clients.controller';
import { ClientsController } from '@src/clients/controller/clients.controller';
import { ClientsEntity } from '@src/clients/clients.entity';
import { ClientsService } from '@src/clients/service/clients.service';
import { AuthClientsService } from '@src/clients/service/auth.clients.service';
import { TokenClientsService } from '@src/clients/service/token.clients.service';
import { ClientsStrategy } from '@src/clients/clients.strategy';
import { ClientsResolver } from '@src/clients/clients.resolver';
import { ConfigModule } from '@nestjs/config';
import { TokensModule } from '@src/tokens/tokens.module';
import { AuthModule } from '@src/auth/auth.module';
import { RedirectsModule } from '@src/redirects/redirects.module';

@Module({
  controllers: [
    ClientsController,
    AuthClientsController,
    TokenClientsController,
  ],
  imports: [
    TypeOrmModule.forFeature([ClientsEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => TokensModule),
    forwardRef(() => RedirectsModule),
    ConfigModule,
  ],
  providers: [
    ClientsService,
    AuthClientsService,
    TokenClientsService,
    ClientsStrategy,
    ClientsResolver,
  ],
  exports: [
    ClientsService,
    AuthClientsService,
    TokenClientsService,
  ],
})
export class ClientsModule {}
