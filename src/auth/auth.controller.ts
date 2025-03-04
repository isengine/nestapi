import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Auth, Self } from './auth.decorator';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Auth()
  @Get('self')
  @ApiExcludeEndpoint()
  async self(@Self() auth: AuthDto) {
    const { id } = auth;
    const result = await this.authService.findOne({
      id,
      relations: [{ name: 'strategies' }],
    });
    if (!result) {
      throw new NotFoundException('Entrie not found');
    }
    return result;
  }
}
