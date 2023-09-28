import { InputType } from '@nestjs/graphql';
import { AuthDto } from '@src/auth/dto/auth.dto';
import { TokensDto } from '@src/auth/dto/tokens.dto';

@InputType()
export class MixinDto extends AuthDto {}

Object.assign(MixinDto.prototype, TokensDto);
