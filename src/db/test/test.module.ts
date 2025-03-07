import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestController } from './test.controller';
import { TestEntity } from './test.entity';
import { TestResolver } from './test.resolver';
import { TestService } from './test.service';

@Module({
  controllers: [TestController],
  imports: [TypeOrmModule.forFeature([TestEntity])],
  providers: [TestService, TestResolver],
  exports: [TestService],
})
export class TestModule {}
