import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsController } from '@src/tags/tags.controller';
import { TagsEntity } from '@src/tags/tags.entity';
import { TagsService } from '@src/tags/tags.service';
import { TagsResolver } from '@src/tags/tags.resolver';
import { PostsModule } from '@src/posts/posts.module';

@Module({
  controllers: [TagsController],
  imports: [
    TypeOrmModule.forFeature([TagsEntity]),
    forwardRef(() => PostsModule),
  ],
  providers: [TagsService, TagsResolver],
  exports: [TagsService],
})
export class TagsModule {}
