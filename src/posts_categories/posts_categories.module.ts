import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsCategoriesController } from '@src/posts_categories/posts_categories.controller';
import { PostsCategoriesEntity } from '@src/posts_categories/posts_categories.entity';
import { PostsCategoriesService } from '@src/posts_categories/posts_categories.service';
import { PostsCategoriesResolver } from '@src/posts_categories/posts_categories.resolver';
import { PostsModule } from '@src/posts/posts.module';

@Module({
  controllers: [PostsCategoriesController],
  imports: [
    TypeOrmModule.forFeature([PostsCategoriesEntity]),
    forwardRef(() => PostsModule),
  ],
  providers: [PostsCategoriesService, PostsCategoriesResolver],
  exports: [PostsCategoriesService],
})
export class PostsCategoriesModule {}
