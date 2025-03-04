import { Injectable } from '@nestjs/common';
import { AuthDto } from '@src/auth/auth.dto';
import { GrantsTokenDto } from '@src/token/dto/grants.token.dto';
import { ConfigService } from '@nestjs/config';
import { MethodsAuthService } from './methods.auth.service';

@Injectable()
export class FormsAuthService {
  constructor(
    private readonly configService: ConfigService,
    protected readonly methodsAuthService: MethodsAuthService,
  ) {}

  async change(authDto: AuthDto, code: string, req, res): Promise<any> {
    const result = await this.methodsAuthService.change(
      authDto,
      code,
      req,
      res,
    );
    if (!result?.success) {
      const errorPrepared = await this.prepareRedirectError(result);
      const url = this.configService.get('FORM_CHANGE');
      return await res.redirect(`${url}${errorPrepared}`);
    }
    const url = this.configService.get('FORM_CHANGE_COMPLETE');
    return await res.redirect(url);
  }

  async confirm(code: string, req, res): Promise<any> {
    const result = await this.methodsAuthService.confirm(code, req, res);
    if (!result?.success) {
      const errorPrepared = await this.prepareRedirectError(result);
      const url = this.configService.get('FORM_CONFIRM');
      return await res.redirect(`${url}${errorPrepared}`);
    }
    const url = this.configService.get('FORM_CONFIRM_COMPLETE');
    return await res.redirect(url);
  }

  async login(
    grantsTokenDto: GrantsTokenDto,
    response_type: string,
    req,
    res,
  ): Promise<any> {
    const result = await this.methodsAuthService.login(
      grantsTokenDto,
      req,
      res,
    );
    if (!result?.success) {
      const errorPrepared = await this.prepareRedirectError(result);
      const url = this.configService.get('FORM_LOGIN');
      return await res.redirect(`${url}${errorPrepared}`);
    }
    if (!response_type) {
      return result;
    }
    const { headers, protocol } = req;
    const prefix = this.configService.get('PREFIX');
    const { redirect_uri, client_id } = grantsTokenDto;
    const url = `/auth?client_id=${client_id}&response_type=${response_type}&redirect_uri=${redirect_uri}`;
    return await res.redirect(`${protocol}://${headers.host}${prefix}${url}`);
  }

  async logout(req, res): Promise<any> {
    const result = await this.methodsAuthService.logout(req, res);
    if (!result?.success) {
      const errorPrepared = await this.prepareRedirectError(result);
      const url = this.configService.get('FORM_LOGIN');
      return await res.redirect(`${url}${errorPrepared}`);
    }
    const url = this.configService.get('FORM_LOGIN');
    return await res.redirect(url);
  }

  async register(authDto: AuthDto, subject: string, req, res): Promise<any> {
    const result = await this.methodsAuthService.register(
      authDto,
      subject,
      req,
      res,
    );
    if (!result?.success) {
      const errorPrepared = await this.prepareRedirectError(result);
      const url = this.configService.get('FORM_REGISTER');
      return await res.redirect(`${url}${errorPrepared}`);
    }
    const url = this.configService.get('FORM_REGISTER_COMPLETE');
    return await res.redirect(url);
  }

  async reset(authDto: AuthDto, subject: string, req, res): Promise<any> {
    const result = await this.methodsAuthService.reset(
      authDto,
      subject,
      req,
      res,
    );
    if (!result?.success) {
      const errorPrepared = await this.prepareRedirectError(result);
      const url = this.configService.get('FORM_RESET');
      return await res.redirect(`${url}${errorPrepared}`);
    }
    const url = this.configService.get('FORM_RESET_COMPLETE');
    return await res.redirect(url);
  }

  async prepareRedirectError(error = undefined) {
    if (!error) {
      error = {
        error: 'Bad request',
        message: 'Unknown error',
      };
    }
    const errorArray = [];
    for (const [key, value] of Object.entries({ ...error })) {
      errorArray.push(`${key}=${encodeURI(`${value}`)}`);
    }
    return `?${errorArray.join('&')}`;
  }
}
