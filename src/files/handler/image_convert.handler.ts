import { Injectable } from '@nestjs/common';
import { FilesInterface } from '@src/files/files.interface';
import * as sharp from 'sharp';
import { GetImageMetadataHandler } from './get_image_metadata.handler';

@Injectable()
export class ImageConvertHandler {
  constructor(
    protected readonly getImageMetadataHandler: GetImageMetadataHandler,
  ) {}
  async convertMultipagesToWebp(file: Buffer): Promise<Buffer> {
    const { pages } = await this.getImageMetadataHandler.getImageMetadata(file);
    return await sharp(file, { animated: pages && pages > 1 })
      .webp()
      .toBuffer();
  }

  async convertToWebp(file: Buffer): Promise<Buffer> {
    return await sharp(file).webp().toBuffer();
  }

  async imageConvert(file: FilesInterface) {
    const { mimetype, originalname } = file;
    const type = mimetype.split('/')[1];

    const arrayname = originalname.split('.');
    arrayname.pop();
    const name = arrayname.join('.');

    let extension = 'svg';
    let mime = type;

    if (type !== 'svg+xml') {
      file.buffer = await this.convertToWebp(file.buffer);
      extension = 'webp';
      mime = extension;
    }

    const { size } = await this.getImageMetadataHandler.getImageMetadata(
      file.buffer,
    );

    return new FilesInterface({
      buffer: file.buffer,
      originalname: `${name}.${extension}`,
      mimetype: `image/${mime}`,
      size,
    });
  }
}
