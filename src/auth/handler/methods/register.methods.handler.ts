import { BadRequestException, Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcryptjs';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthEntity } from '@src/auth/auth.entity';
import { AuthService } from '@src/auth/auth.service';

@Injectable()
export class RegisterMethodsHandler {
  constructor(
    protected readonly authService: AuthService,
  ) {}

  async register(authDto: AuthDto): Promise<AuthEntity> {
    const authExists = await this.authService.findByUsername(authDto.username);
    if (authExists) {
      throw new BadRequestException(
        'User with this username is already in the system',
      );
    }
    const salt = await genSalt(10);
    authDto.password = await hash(authDto.password, salt);

    // используйте данную строку, если пользователь будет сразу же активирован
    // authDto.isActivated = true;

    return await this.authService.create(authDto);
  }
}
