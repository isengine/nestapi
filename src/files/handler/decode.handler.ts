import { Injectable } from '@nestjs/common';
import { FilesInterface } from '@src/files/files.interface';

@Injectable()
export class DecodeHandler {
  decode(file: FilesInterface) {
    const { originalname } = file;
    const buffer = Buffer.from(originalname, 'ascii');
    const decodedString = buffer.toString('utf-8');

    return new FilesInterface({
      buffer: file.buffer,
      originalname: decodedString,
      mimetype: file.mimetype,
      size: file.size,
    });
  }
}
