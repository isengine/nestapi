import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class GetImageMetadataHandler {
  async getImageMetadata(file: Buffer) {
    return await sharp(file).metadata();
  }
}
