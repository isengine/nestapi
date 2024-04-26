import { BadRequestException, Controller, Get, Header, Post, Render, Res, Req } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { AppService } from '@src/app.service';
import axios from 'axios';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('form/auth')
  async auth(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    const { body, headers, protocol } = req;

    const token = await axios({
      url: `${protocol}://${headers.host}/token`,
      method: 'post',
      data: {
        grant_type: 'password',
        username: body.username,
        password: body.password,
      },
      withCredentials: true,
    })
    
    const access_token = token?.data?.access_token;

    if (!access_token) {
      throw new BadRequestException('Specified datas is not valid for generate token', 'do not issue token');
    }
  
    res.cookie(
      'jwt',
      access_token,
      {
        httpOnly: true,
        secure: false,
      },
    );
    // localStorage.setItem('jwt', access_token);

    if (!req.body?.data) {
      return token?.data;
    }

    const { data } = req.body;

    const dataDecoded = await Buffer.from(data, 'base64').toString('utf-8');
    const dataParsed = dataDecoded ? JSON.parse(dataDecoded) : {};

    const response = await axios({
      url: dataParsed.url,
      method: dataParsed.method,
      data: dataParsed.body,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    });

    return response?.data;
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
