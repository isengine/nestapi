import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { TokenService } from '@src/token/token.service';

@Injectable()
export class FormsService {
  constructor(private readonly tokenService: TokenService) {}

  async auth(req, res): Promise<void> {
    const { body, headers, protocol } = req;
    const url = `${protocol}://${headers.host}/token`;
    console.log('-- url', url);

    const token = await axios({
      url,
      method: 'post',
      data: {
        grant_type: 'password',
        username: body.username,
        password: body.password,
      },
      withCredentials: true,
    }).then((r) => r?.data);
    console.log('-- token', token);
    
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

    console.log('-- body.data', body.data);

    if (!body.redirect_uri) {
      return token;
    }

    const { redirect_uri, client_id, response_type } = body;
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
}
