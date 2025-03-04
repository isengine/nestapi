import { Injectable } from '@nestjs/common';
import { FilesInterface } from '@src/files/files.interface';
import { v4 } from 'uuid';

@Injectable()
export class RenameHandler {
  rename(file: FilesInterface, extension = undefined) {
    if (!extension) {
      const { originalname } = file;
      extension = originalname.split('.').pop();
    }
    const name = v4();
    return new FilesInterface({
      buffer: file.buffer,
      originalname: `${name}.${extension}`,
      mimetype: file.mimetype,
      size: file.size,
    });
  }
}
