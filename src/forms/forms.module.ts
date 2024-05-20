import { Module, forwardRef } from '@nestjs/common';
import { FormsController } from '@src/forms/forms.controller';
import { FormsService } from '@src/forms/forms.service';
import { AuthModule } from '@src/auth/auth.module';
import { ConfirmModule } from '@src/confirm/confirm.module';
import { MailModule } from '@src/mail/mail.module';
import { TokenModule } from '@src/token/token.module';

import { AuthFormsService } from '@src/forms/service/auth.service';
import { ChangeFormsService } from '@src/forms/service/change.service';
import { ConfirmFormsService } from '@src/forms/service/confirm.service';
import { HelpersFormsService } from '@src/forms/service/helpers.service';
import { RegisterFormsService } from '@src/forms/service/register.service';
import { RestoreFormsService } from '@src/forms/service/restore.service';

@Module({
  controllers: [FormsController],
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => ConfirmModule),
    forwardRef(() => MailModule),
    forwardRef(() => TokenModule),
  ],
  providers: [
    FormsService,
    AuthFormsService,
    ChangeFormsService,
    ConfirmFormsService,
    HelpersFormsService,
    RegisterFormsService,
    RestoreFormsService,
  ],
})
export class FormsModule {}
