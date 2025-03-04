import { Injectable } from '@nestjs/common';
import {
  randomSets,
  randomNames,
  randomEnNames,
  randomRuNames,
} from './random.const';

@Injectable()
export class RandomService {
  random(min, max, step = 1) {
    const mmax = max;
    const koeff = 1 / step;
    max *= koeff;
    const rand = min + Math.random() * (max + 1 - min);
    let result = Math.floor(rand) / koeff;
    if (result > mmax) {
      result -= step;
    }
    if (result < min) {
      result += step;
    }
    return result;
  }

  randomString(min, max = undefined, string = '') {
    if (!max) {
      max = min;
    } else if (min !== max) {
      max = this.random(min, max);
    }
    let result = '';

    const { length } = string;
    for (let i = 0; i < max; i++) {
      result += string.charAt(Math.floor(Math.random() * length));
    }

    return result;
  }

  randomSet(min, max = undefined, name = '') {
    const sets = randomSets;

    const names = !name
      ? Object.keys(sets)
      : name.replace(/\W+/giu, ' ').split(' ');

    let string = '';
    names.forEach((i) => {
      string += sets[i];
    });

    return this.randomString(min, max, string);
  }

  randomNum(min, max = undefined) {
    return this.randomString(min, max, '0123456789');
  }

  randomBin(min, max = undefined) {
    return this.randomString(min, max, '01');
  }

  randomHex(min, max = undefined) {
    return this.randomString(min, max, '0123456789ABCDEF');
  }

  randomArray(n, callback = (i) => i) {
    return [...Array(n)].map((_, i) => callback(i));
  }

  shuffleArray([...array]) {
    return array.sort(() => Math.random() - 0.5);
  }

  randomOption(...args) {
    if (!args || !args.length) {
      return '';
    }
    const options = typeof args[0] === 'object' ? args[0] : args;
    const index = this.random(1, options.length) - 1;
    return options[index];
  }

  randomEmail(min = 9, max = 30) {
    const string = '0123456789abcdefghijklmnopqrstuvwxyz._-';
    const result = this.randomString(min, max, string);
    const middle = Math.floor(result.length / 2);
    const last = this.randomString(2, 4, 'abcdefghijklmnopqrstuvwxyz');
    return `${result.substring(0, middle)}@${result.substring(middle)}.${last}`
      .replace(/\W*@\W*/u, '@')
      .replace(/\.{2,}/u, '.');
  }

  randomName({
    min = 5,
    max = 8,
    // гласные
    vowels,
    // согласные
    consonants,
    // массив нормального количества гласных и согласных в составе слова
    normals = [1, 1],
    // массив нормального количества гласных и согласных в окончании
    finals = [0, 1],
    // массив окончаний
    endings = undefined,
  }) {
    const letters = [
      `${vowels}${vowels}`.toLowerCase(),
      consonants.toLowerCase(),
    ];
    let string = this.randomString(min, max, letters.join(''));

    normals?.forEach((num, index) => {
      const regexp = new RegExp(`[${letters[index]}]{${+num + 1},}`, 'igu');
      string.match(regexp)?.forEach((n) => {
        string = string.replace(n, n.substring(0, +num));
      });
    });

    finals?.forEach((num, index) => {
      const regexp = `[${letters[index]}]{${+num + 1},}$`;
      const regexpMatch = new RegExp(regexp, 'iu');
      const regexpReplace = new RegExp(`(.*?)${regexp}`, 'iu');
      string.match(regexpMatch)?.forEach((n) => {
        string = string.replace(regexpReplace, `\$1${n.substring(0, +num)}`);
      });
    });

    if (!string.match(new RegExp(`[${letters[0]}]+`, 'iu'))) {
      string = `${string}${this.randomString(1, 1, letters[0])}`;
    }
    if (!string.match(new RegExp(`[${letters[1]}]+`, 'iu'))) {
      string = `${string}${this.randomString(1, 1, letters[1])}`;
    }

    string = `${string.substring(0, 1).toUpperCase()}${string.substring(1)}`;
    const ending = endings && endings.length ? this.randomOption(endings) : '';
    return `${string}${ending}`;
  }

  randomNames(words = 1) {
    const gender = this.random(0, 1);
    const { vowels, consonants, normals } = randomNames;
    const finals = [gender ? 2 : 0, gender ? 0 : 2];
    const result: Array<string | number> = [gender];

    while (words > 0) {
      const name = this.randomName({
        vowels,
        consonants,
        normals,
        finals,
        endings: undefined,
      });
      result.push(name);
      words -= 1;
    }
    return result;
  }

  randomEnNames(words = 1) {
    const { vowels, consonants } = randomEnNames;
    const woman = randomEnNames.endings[0];
    const families = randomEnNames.endings[1];
    const gender = this.random(0, 1);
    const result: Array<string | number> = [gender];

    while (words > 0) {
      const name = this.randomName({
        vowels,
        consonants,
        endings: words === 1 ? families : gender ? woman : undefined,
      });
      result.push(name);
      words -= 1;
    }
    return result;
  }

  randomRuNames(words = 1) {
    const { vowels, consonants, endings } = randomRuNames;
    const gender = this.random(0, 1);
    const result: Array<string | number> = [gender];

    let n = 0;
    while (words > 0) {
      const name = this.randomName({
        min: n === 1 ? 5 : 3,
        max: n === 1 ? 8 : 5,
        vowels,
        consonants,
        endings: endings[n]?.[gender] || [],
      });
      result.push(name);
      words -= 1;
      n += 1;
    }
    return result;
  }
}
