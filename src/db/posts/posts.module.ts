import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsCategoriesModule } from './posts_categories/posts_categories.module';
import { PostsTagsModule } from './posts_tags/posts_tags.module';
import { PostsController } from './posts.controller';
import { PostsEntity } from './posts.entity';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';

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
