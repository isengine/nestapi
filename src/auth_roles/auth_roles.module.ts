import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@src/auth/auth.module';

import { AuthRolesController } from '@src/auth_roles/auth_roles.controller';
import { AuthRolesEntity } from '@src/auth_roles/auth_roles.entity';
import { AuthRolesService } from '@src/auth_roles/auth_roles.service';
import { AuthRolesFactory } from '@src/auth_roles/auth_roles.factory';
import { AuthRolesResolver } from '@src/auth_roles/auth_roles.resolver';

@Module({
  controllers: [AuthRolesController],
  imports: [
    TypeOrmModule.forFeature([AuthRolesEntity]),
    forwardRef(() => AuthModule),
  ],
  providers: [AuthRolesFactory, AuthRolesService, AuthRolesResolver],
  exports: [AuthRolesFactory, AuthRolesService],
})
export class AuthRolesModule {}
