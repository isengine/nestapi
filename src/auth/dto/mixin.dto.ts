import { InputType } from '@nestjs/graphql';
import { AuthDto } from '@src/auth/dto/auth.dto';
import { TokensDto } from '@src/tokens/tokens.dto';

@InputType()
export class MixinDto extends AuthDto {}

Object.assign(MixinDto.prototype, TokensDto);
