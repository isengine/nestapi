import { UseGuards, applyDecorators } from '@nestjs/common';
import { TypeRole } from '@src/auth/interface/auth.interface';
import { JwtAuthGuard } from '@src/auth/guard/jwt.guard';
import { OnlyAdminGuard } from '@src/auth/guard/admin.guard';

export const Auth = (role: TypeRole = 'user') => {
  if (role === 'admin') {
    return applyDecorators(UseGuards(JwtAuthGuard, OnlyAdminGuard));
  }
  if (role === 'user') {
    return applyDecorators(UseGuards(JwtAuthGuard));
  }
  return applyDecorators();
};
