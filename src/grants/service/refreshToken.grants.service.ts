import { Injectable, BadRequestException } from '@nestjs/common';
import { GrantsDto } from '@src/grants/grants.dto';
import { AuthGrantsService } from '@src/grants/service/auth.grants.service';
import { ClientGrantsService } from '@src/grants/service/client.grants.service';

@Injectable()
export class RefreshTokenGrantsService {
  constructor(
    private readonly authGrantsService: AuthGrantsService,
    private readonly clientGrantsService: ClientGrantsService,
  ) {}

  async refreshToken(grantsDto: GrantsDto): Promise<any> {
    if (grantsDto.grant_type !== 'refresh_token') {
      throw new BadRequestException('Specified type of grant_type field is not supported in this request', 'unsupported_grant_type');
    }
    if (!grantsDto.refresh_token) {
      throw new BadRequestException('Not specified refresh token in this request', 'invalid_grant');
    }
    if (grantsDto.client_id || grantsDto.client_secret) {
      return await this.clientGrantsService.client(grantsDto);
    }
    return await this.authGrantsService.auth(grantsDto);
  }
}
