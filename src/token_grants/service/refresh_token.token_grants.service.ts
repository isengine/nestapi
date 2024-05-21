import { Injectable, BadRequestException } from '@nestjs/common';
import { TokenGrantsDto } from '@src/token_grants/token_grants.dto';
import { AuthGrantsService } from '@src/token_grants/service/auth.token_grants.service';
import { ClientGrantsService } from '@src/token_grants/service/client.token_grants.service';

@Injectable()
export class RefreshTokenGrantsService {
  constructor(
    private readonly authGrantsService: AuthGrantsService,
    private readonly clientGrantsService: ClientGrantsService,
  ) {}

  async refreshToken(tokenGrantsDto: TokenGrantsDto): Promise<any> {
    if (tokenGrantsDto.grant_type !== 'refresh_token') {
      throw new BadRequestException('Specified type of grant_type field is not supported in this request', 'unsupported_grant_type');
    }
    if (!tokenGrantsDto.refresh_token) {
      throw new BadRequestException('Not specified refresh token in this request', 'invalid_grant');
    }
    if (tokenGrantsDto.client_id || tokenGrantsDto.client_secret) {
      return await this.clientGrantsService.client(tokenGrantsDto);
    }
    return await this.authGrantsService.auth(tokenGrantsDto);
  }
}
