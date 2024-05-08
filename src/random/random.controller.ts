import { Body, Controller, Get } from '@nestjs/common';
import { Auth } from '@src/common/common.decorator';
import { RandomService } from '@src/random/random.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('random')
export class RandomController {
  constructor(private readonly randomService: RandomService) {}

  @Get('random')
  @Auth()
  random(
    @Body('min') min: number,
    @Body('max') max: number,
    @Body('step') step = 1,
  ) {
    return this.randomService.random(min, max, step);
  }

  @Get('string')
  @Auth()
  randomString(min, max = undefined, string = '') {
    return this.randomService.randomString(min, max, string);
  }

  @Get('set')
  @Auth()
  randomSet(min, max = undefined, name = '') {
    return this.randomService.randomSet(min, max, name);
  }

  @Get('num')
  @Auth()
  randomNum(min, max = undefined) {
    return this.randomService.randomNum(min, max);
  }

  @Get('bin')
  @Auth()
  randomBin(min, max = undefined) {
    return this.randomService.randomBin(min, max);
  }

  @Get('hex')
  @Auth()
  randomHex(min, max = undefined) {
    return this.randomService.randomHex(min, max);
  }

  @Get('array')
  @Auth()
  randomArray(n, callback = (i) => i) {
    return this.randomService.randomArray(n, callback);
  }

  @Get('shuffle_array')
  @Auth()
  shuffleArray([...array]) {
    return this.randomService.shuffleArray(array);
  }

  @Get('option')
  @Auth()
  randomOption(...args) {
    return this.randomService.randomOption(...args);
  }

  @Get('email')
  @Auth()
  randomEmail(min = 9, max = 30) {
    return this.randomService.randomEmail(min, max);
  }

  @Get('names')
  @Auth()
  randomNames(words = 1) {
    return this.randomService.randomNames(words);
  }

  @Get('en_names')
  @Auth()
  randomEnNames(words = 1) {
    return this.randomService.randomEnNames(words);
  }

  @Get('ru_names')
  @Auth()
  randomRuNames(words = 1) {
    return this.randomService.randomRuNames(words);
  }
}
