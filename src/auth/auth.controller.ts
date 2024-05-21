import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { AuthDto } from '@src/auth/auth.dto';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Auth, Self } from '@src/auth/auth.decorator';
import { Data } from '@src/common/common.decorator';
import { CommonDoc } from '@src/common/common.doc';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Auth()
  @Get('self')
  @ApiExcludeEndpoint()
  async clientsSelf(@Self() auth: AuthDto) {
    const { id } = auth;
    const result = await this.authService.findOne(id, [{ name: 'users' }, { name: 'strategies' }]);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }
}
