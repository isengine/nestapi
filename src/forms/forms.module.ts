import { Module } from '@nestjs/common';
import { FormsController } from '@src/forms/forms.controller';

@Module({
  controllers: [FormsController],
  imports: [],
  providers: [],
})
export class FormsModule {}
