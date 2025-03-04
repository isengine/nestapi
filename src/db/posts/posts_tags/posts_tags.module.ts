import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from '../posts.module';
import { PostsTagsController } from './posts_tags.controller';
import { PostsTagsEntity } from './posts_tags.entity';
import { PostsTagsResolver } from './posts_tags.resolver';
import { PostsTagsService } from './posts_tags.service';

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
