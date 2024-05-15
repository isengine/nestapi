import { Module, forwardRef } from '@nestjs/common';
import { FormsController } from '@src/forms/forms.controller';
import { FormsService } from '@src/forms/forms.service';
import { AuthModule } from '@src/auth/auth.module';
import { MailModule } from '@src/mail/mail.module';
import { TokenModule } from '@src/token/token.module';

@Module({
  controllers: [FormsController],
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => MailModule),
    forwardRef(() => TokenModule),
  ],
  providers: [FormsService],
})
export class FormsModule {}
