import { BadRequestException, Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcryptjs';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthEntity } from '@src/auth/auth.entity';
import { CreateAuthService } from '@src/auth/service/create.auth.service';
import { FindByUsernameAuthService } from '@src/auth/service/findByUsername.auth.service';

@Injectable()
export class RegisterAuthService {
  constructor(
    protected readonly createAuthService: CreateAuthService,
    protected readonly findByUsernameAuthService: FindByUsernameAuthService,
  ) {}

  async register(authDto: AuthDto): Promise<AuthEntity> {
    const authExists = await this.findByUsernameAuthService.findByUsername(authDto.username);
    if (authExists) {
      throw new BadRequestException(
        'User with this username is already in the system',
      );
    }
    const salt = await genSalt(10);
    authDto.password = await hash(authDto.password, salt);

    // используйте данную строку, если пользователь будет сразу же активирован
    // authDto.isActivated = true;

    return await this.createAuthService.create(authDto);
  }
}
