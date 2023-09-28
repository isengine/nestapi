import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '@src/users/users.controller';
import { UsersEntity } from '@src/users/users.entity';
import { UsersService } from '@src/users/users.service';
import { UsersResolver } from '@src/users/users.resolver';
import { AuthModule } from '@src/auth/auth.module';
import { PostsModule } from '@src/posts/posts.module';

@Module({
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => PostsModule),
  ],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
