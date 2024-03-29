import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesController } from '@src/roles/roles.controller';
import { RolesEntity } from '@src/roles/roles.entity';
import { RolesService } from '@src/roles/roles.service';
import { RolesFactory } from '@src/roles/roles.factory';
import { RolesResolver } from '@src/roles/roles.resolver';

@Module({
  controllers: [RolesController],
  imports: [TypeOrmModule.forFeature([RolesEntity])],
  providers: [RolesFactory, RolesService, RolesResolver],
  exports: [RolesFactory, RolesService],
})
export class RolesModule {}
