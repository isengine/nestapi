import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from '@src/posts/posts.controller';
import { PostsEntity } from '@src/posts/posts.entity';
import { PostsService } from '@src/posts/posts.service';
import { PostsResolver } from '@src/posts/posts.resolver';
import { CategoriesModule } from '@src/categories/categories.module';
import { TagsModule } from '@src/tags/tags.module';
import { UsersModule } from '@src/users/users.module';

@Module({
  controllers: [PostsController],
  imports: [
    TypeOrmModule.forFeature([PostsEntity]),
    forwardRef(() => CategoriesModule),
    forwardRef(() => TagsModule),
    forwardRef(() => UsersModule),
  ],
  providers: [PostsService, PostsResolver],
  exports: [PostsService],
})
export class PostsModule {}
