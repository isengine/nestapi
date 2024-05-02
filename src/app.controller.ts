import { BadRequestException, Controller, Get, Header, Post, Render, Res, Req } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { AppService } from '@src/app.service';
import axios from 'axios';
import { TokenService } from '@src/token/token.service';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('form/auth')
  async auth(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
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

  @Get('form/login.html')
  @Render('login')
  login(@Req() req: any) {
    return { query: req.query };
  }

  @Get('form/register.html')
  @Render('register')
  register(@Req() req: any) {
    return { query: req.query };
  }

  @Get('form/restore.html')
  @Render('restore')
  restore(@Req() req: any) {
    return { query: req.query };
  }

  @Get('form/confirm.html')
  @Render('confirm')
  confirm(@Req() req: any) {
    return { query: req.query };
  }

  @Get()
  @Header('Content-Type', 'application/json')
  hello(): string {
    return this.appService.hello();
  }
}
