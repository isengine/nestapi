import { Module } from '@nestjs/common';
import { AuthFormsController } from '@src/auth_forms/auth_forms.controller';

@Module({
  controllers: [AuthFormsController],
  imports: [],
  providers: [],
})
export class AuthFormsModule {}
