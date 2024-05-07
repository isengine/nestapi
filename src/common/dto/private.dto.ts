import { InputType } from '@nestjs/graphql';
import { ProtectedDto } from '@src/common/dto/protected.dto';

@InputType()
export class PrivateDto extends ProtectedDto  {}
