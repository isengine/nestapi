import { BadRequestException, UnauthorizedException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { AuthService } from '@src/auth/auth.service';
import { TokenService } from '@src/token/token.service';
import { AuthEntity } from '@src/auth/auth.entity';

@Injectable()
export class FormsService {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  async auth(req, res): Promise<void> {
    const { body, headers, protocol } = req;
    const url = `${protocol}://${headers.host}/token`;
    const token = await axios({
      url,
      method: 'post',
      data: {
        grant_type: body.grant_type,
        username: body.username,
        password: body.password,
      },
      withCredentials: true,
    })
      .then((r) => r?.data)
      .catch(async (e) => {
        const back = this.helperBack(req, e.response);
        return await res.redirect(back);
      });

    if (!token) {
      const response = {
        data: {
          error: 'Unauthorized',
          message: 'Unknown error',
        }
      };
      const back = this.helperBack(req, response);
      return await res.redirect(back);
    }

    const access_token = token?.access_token;

    if (!access_token) {
      throw new BadRequestException('Specified datas is not valid for generate token', 'do not issue token');
    }

    const tokenParse = await this.tokenService.tokenVerify(access_token, 'access');

    res.cookie(
      'id',
      tokenParse.id,
      {
        httpOnly: true,
        secure: false,
      },
    );
    // localStorage.setItem('jwt', access_token);
    // console.log('-- body.data', body.data);

    const { redirect_uri, client_id, response_type } = body;

    if (!redirect_uri || !client_id || !response_type) {
      return token;
    }

    // const uri = `${protocol}://${headers.host}/auth?client_id=${client_id}&response_type=${response_type}&redirect_uri=${redirect_uri}`;
    const uri = `/auth?client_id=${client_id}&response_type=${response_type}&redirect_uri=${redirect_uri}`;
    return await res.redirect(uri);

    // const dataDecoded = await Buffer.from(data, 'base64').toString('utf-8');
    // const dataParsed = dataDecoded ? JSON.parse(dataDecoded) : {};
    // 
    // const response = await axios({
    //   url: dataParsed.url,
    //   method: dataParsed.method,
    //   data: dataParsed.body,
    //   withCredentials: true,
    //   headers: {
    //     Authorization: `Bearer ${access_token}`,
    //   }
    // });
    // 
    // return response?.data;
  }

  async confirm(req, res): Promise<void> {
    const { body, headers, protocol } = req;
    const base = `${protocol}://${headers.host}`;
    const url = `${base}/auth/confirm/${body.code}`;
    const result = await axios({
      url,
      method: 'get',
      withCredentials: true,
    })
      .then((r) => r?.data)
      .catch(async (e) => {
        const back = this.helperBack(req, e.response);
        return await res.redirect(back);
      });

    if (!result) {
      const response = {
        data: {
          error: 'Bad request',
          message: 'Invalid confirm code',
        }
      };
      const back = this.helperBack(req, response);
      return await res.redirect(back);
    }

    return await res.redirect(`${base}/forms/confirm_complete.html`);
  }

  async register(req, res): Promise<AuthEntity> {
    const { body, headers, protocol } = req;
    const url = `${protocol}://${headers.host}/auth/register`;
    const result = await axios({
      url,
      method: 'post',
      data: {
        grant_type: body.grant_type,
        username: body.username,
        password: body.password,
      },
      withCredentials: true,
    })
      .then((r) => r?.data)
      .catch(async (e) => {
        const back = this.helperBack(req, e.response);
        return await res.redirect(back);
      });

    if (!result) {
      const response = {
        data: {
          error: 'Bad request',
          message: 'Unknown error',
        }
      };
      const back = this.helperBack(req, response);
      return await res.redirect(back);
    }

    return result;
  }

  async restore(req, res): Promise<AuthEntity> {
    const { body, headers, protocol } = req;
    const base = `${protocol}://${headers.host}`;
    const url = `${base}/auth/restore`;
    const result = await axios({
      url,
      method: 'post',
      data: {
        username: body.username,
      },
      withCredentials: true,
    })
      .then((r) => r?.data)
      .catch(async (e) => {
        const back = this.helperBack(req, e.response);
        return await res.redirect(back);
      });

    if (!result) {
      const response = {
        data: {
          error: 'Bad request',
          message: 'Unknown error',
        }
      };
      const back = this.helperBack(req, response);
      return await res.redirect(back);
    }

    return await res.redirect(`${base}/forms/restore_complete.html`);
  }

  async change(req, res): Promise<void> {
    const { body, headers, protocol } = req;
    const base = `${protocol}://${headers.host}`;
    const url = `${base}/auth/restore/${body.code}`;
    const result = await axios({
      url,
      method: 'post',
      data: {
        username: body.username,
        password: body.password,
      },
      withCredentials: true,
    })
      .then((r) => r?.data)
      .catch(async (e) => {
        const back = this.helperBack(req, e.response);
        return await res.redirect(back);
      });

    if (!result) {
      const response = {
        data: {
          error: 'Bad request',
          message: 'Unknown error',
        }
      };
      const back = this.helperBack(req, response);
      return await res.redirect(back);
    }

    return await res.redirect(`${base}/forms/change_complete.html`);
  }

  helperBack(req, res): string {
    const { body, headers } = req;
    const { referer } = headers;

    const url = new URL(referer);
    const { protocol, host, pathname } = url;
    const ref = `${protocol}//${host}${pathname}`;

    const { data } = res;
    data.message = this.helperErrorMessage(data?.error, data?.message);
    const dataArray = [];
    for (const [key, value] of Object.entries({ ...body, ...data })) {
      dataArray.push(`${key}=${ encodeURI(`${value}`) }`);
    }

    return `${ref}?${dataArray.join('&')}`;
  }

  helperErrorMessage(error = '', message = ''): string {
    const errors = {
      'bad request': 'Ошибка.',
      'unknown error': 'Что-то пошло не так.',
      'unauthorized': 'Ошибка авторизации.',
      'user not found': 'Пользователь не найден.',
      'username must be an email': 'Вы некорректно указали электронную почту.',
      'invalid confirm code': 'Неверный код подтверждения.',
    };
    return `${errors[`${error}`.toLowerCase()] || error} ${errors[`${message}`.toLowerCase()] || message}`;
  }

}
