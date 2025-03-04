import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@src/auth/auth.module';
import { TokenModule } from '@src/token/token.module';
import { PersonsController } from './persons.controller';
import { PersonsEntity } from './persons.entity';
import { PersonsResolver } from './persons.resolver';
import { PersonsService } from './persons.service';

@Module({
  controllers: [PersonsController],
  imports: [
    TypeOrmModule.forFeature([PersonsEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => TokenModule),
  ],
  providers: [PersonsService, PersonsResolver],
  exports: [PersonsService],
})
export class PersonsModule {}
