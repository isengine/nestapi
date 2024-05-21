import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from '@src/posts/posts.controller';
import { PostsEntity } from '@src/posts/posts.entity';
import { PostsService } from '@src/posts/posts.service';
import { PostsResolver } from '@src/posts/posts.resolver';
import { PostsCategoriesModule } from '@src/posts_categories/posts_categories.module';
import { PostsTagsModule } from '@src/posts_tags/posts_tags.module';

@Module({
  controllers: [PostsController],
  imports: [
    TypeOrmModule.forFeature([PostsEntity]),
    forwardRef(() => PostsCategoriesModule),
    forwardRef(() => PostsTagsModule),
  ],
  providers: [PostsService, PostsResolver],
  exports: [PostsService],
})
export class PostsModule {}
