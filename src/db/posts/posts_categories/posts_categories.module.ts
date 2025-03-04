import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from '../posts.module';
import { PostsCategoriesController } from './posts_categories.controller';
import { PostsCategoriesEntity } from './posts_categories.entity';
import { PostsCategoriesResolver } from './posts_categories.resolver';
import { PostsCategoriesService } from './posts_categories.service';

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
