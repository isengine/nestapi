import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from '@src/categories/categories.controller';
import { CategoriesEntity } from '@src/categories/categories.entity';
import { CategoriesService } from '@src/categories/categories.service';
import { CategoriesResolver } from '@src/categories/categories.resolver';
import { PostsModule } from '@src/posts/posts.module';

@Module({
  controllers: [CategoriesController],
  imports: [
    TypeOrmModule.forFeature([CategoriesEntity]),
    forwardRef(() => PostsModule),
  ],
  providers: [CategoriesService, CategoriesResolver],
  exports: [CategoriesService],
})
export class CategoriesModule {}
