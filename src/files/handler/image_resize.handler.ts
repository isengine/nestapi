import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { GetImageMetadataHandler } from './get_image_metadata.handler';

@Injectable()
export class ImageResizeHandler {
  constructor(
    protected readonly getImageMetadataHandler: GetImageMetadataHandler,
  ) {}

  async imageResizeProcess(file: Buffer, options) {
    return await sharp(file).resize(options).toBuffer();
  }

  async imageResize(file: Buffer) {
    const options = {
      width: +process.env.UPLOADS_IMAGE_MAX_WIDTH || 0,
      height: +process.env.UPLOADS_IMAGE_MAX_HEIGHT || 0,
    };
    const { width, height } =
      await this.getImageMetadataHandler.getImageMetadata(file);
    if (options.width && width > height && width > options.width) {
      return await this.imageResizeProcess(file, {
        width: options.width,
      });
    }
    if (options.height && height > options.height) {
      return await this.imageResizeProcess(file, {
        height: options.height,
      });
    }
    return await sharp(file).toBuffer();
  }
}
