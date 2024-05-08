import { Resolver, Query, Args } from '@nestjs/graphql';
import { Auth } from '@src/common/common.decorator';
import { RandomService } from '@src/random/random.service';

@Resolver('random')
export class RandomResolver {
  constructor(private readonly randomService: RandomService) {}

  /*
  @Query(() => Number)
  @Auth('gql')
  random(
    @Args('min') min: number,
    @Args('max') max: number,
    @Args('step') step = 1,
  ): number {
    return this.randomService.random(min, max, step);
  }

  @Query()
  @Auth('gql')
  randomString(min, max = undefined, string = '') {
    return this.randomService.randomString(min, max, string);
  }

  @Query()
  @Auth('gql')
  randomSet(min, max = undefined, name = '') {
    return this.randomService.randomSet(min, max, name);
  }

  @Query()
  @Auth('gql')
  randomNum(min, max = undefined) {
    return this.randomService.randomNum(min, max);
  }

  @Query()
  @Auth('gql')
  randomBin(min, max = undefined) {
    return this.randomService.randomBin(min, max);
  }

  @Query()
  @Auth('gql')
  randomHex(min, max = undefined) {
    return this.randomService.randomHex(min, max);
  }

  @Query()
  @Auth('gql')
  randomArray(n, callback = (i) => i) {
    return this.randomService.randomArray(n, callback);
  }

  @Query()
  @Auth('gql')
  shuffleArray([...array]) {
    return this.randomService.shuffleArray(array);
  }

  @Query()
  @Auth('gql')
  randomOption(...args) {
    return this.randomService.randomOption(...args);
  }

  @Query()
  @Auth('gql')
  randomEmail(min = 9, max = 30) {
    return this.randomService.randomEmail(min, max);
  }

  @Query()
  @Auth('gql')
  randomNames(words = 1) {
    return this.randomService.randomNames(words);
  }

  @Query()
  @Auth('gql')
  randomEnNames(words = 1) {
    return this.randomService.randomEnNames(words);
  }

  @Query()
  @Auth('gql')
  randomRuNames(words = 1) {
    return this.randomService.randomRuNames(words);
  }
  */
}
