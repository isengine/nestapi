import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonsController } from '@src/persons/persons.controller';
import { PersonsEntity } from '@src/persons/persons.entity';
import { PersonsService } from '@src/persons/persons.service';
import { PersonsResolver } from '@src/persons/persons.resolver';
import { AuthModule } from '@src/auth/auth.module';
import { TokenModule } from '@src/token/token.module';

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
