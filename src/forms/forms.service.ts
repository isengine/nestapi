import { BadRequestException, UnauthorizedException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { TokenService } from '@src/token/token.service';

@Injectable()
export class FormsService {
  constructor(private readonly tokenService: TokenService) {}

  async auth(req, res): Promise<void> {
    const { body, headers, protocol } = req;
    const url = `${protocol}://${headers.host}/token`;
    let token;

    try {
      token = await axios({
        url,
        method: 'post',
        data: {
          grant_type: 'password',
          username: body.username,
          password: body.password,
        },
        withCredentials: true,
      }).then((r) => r?.data);
    } catch (e) {
      const back = this.back(req, e.response);
      return await res.redirect(back);
    }
    
    if (!token) {
      return;
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

  async register(req, res): Promise<void> {
    const { body, headers, protocol } = req;
    const url = `${protocol}://${headers.host}/token`;
    console.log('-- register...');
    console.log('-- headers', headers);
  }

  back(req, res): string {
    const { body, headers } = req;
    const { referer } = headers;

    const url = new URL(referer);
    const { protocol, host, pathname } = url;
    const ref = `${protocol}//${host}${pathname}`;

    const { data } = res;
    data.message = this.errorMessage(data?.error, data?.message);
    const dataArray = [];
    for (const [key, value] of Object.entries({ ...body, ...data })) {
      dataArray.push(`${key}=${ encodeURI(`${value}`) }`);
    }

    return `${ref}?${dataArray.join('&')}`;
  }

  errorMessage(error = '', message = ''): string {
    const errors = {
      'Unauthorized': 'Ошибка авторизации.',
      'User not found': 'Пользователь не найден.',
    };
    return `${errors[error] || error} ${errors[message] || message}`;
  }

}
