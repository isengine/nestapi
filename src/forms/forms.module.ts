import { Module, forwardRef } from '@nestjs/common';import { TokenModule } from '@src/token/token.module';
import { FormsController } from '@src/forms/forms.controller';
import { FormsService } from '@src/forms/forms.service';

@Module({
  controllers: [FormsController],
  imports: [
    forwardRef(() => TokenModule),
  ],
  providers: [FormsService],
})
export class FormsModule {}
