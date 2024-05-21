import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsTagsController } from '@src/posts_tags/posts_tags.controller';
import { PostsTagsEntity } from '@src/posts_tags/posts_tags.entity';
import { PostsTagsService } from '@src/posts_tags/posts_tags.service';
import { PostsTagsResolver } from '@src/posts_tags/posts_tags.resolver';
import { PostsModule } from '@src/posts/posts.module';

@Module({
  controllers: [PostsTagsController],
  imports: [
    TypeOrmModule.forFeature([PostsTagsEntity]),
    forwardRef(() => PostsModule),
  ],
  providers: [PostsTagsService, PostsTagsResolver],
  exports: [PostsTagsService],
})
export class PostsTagsModule {}
