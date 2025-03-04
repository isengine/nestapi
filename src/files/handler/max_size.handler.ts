import { Injectable } from '@nestjs/common';
import { FilesInterface } from '@src/files/files.interface';

@Injectable()
export class MaxSizeHandler {
  maxSize(file: FilesInterface) {
    const maxSize = +process.env.UPLOADS_MAX_SIZE || 0;
    const { size } = file;
    return !maxSize || size <= maxSize;
  }
}
