import { Injectable } from '@nestjs/common';
import { FilesInterface } from '@src/files/files.interface';

@Injectable()
export class IsImageHandler {
  async isImage(file: FilesInterface) {
    const { mimetype } = file;
    return mimetype.includes('image');
  }
}
