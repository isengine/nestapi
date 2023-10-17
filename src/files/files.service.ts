import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FilesInterface } from './files.interface';
import { access, mkdir, writeFile } from 'fs/promises';
import * as sharp from 'sharp';
import { join } from 'path';
import { v4 } from 'uuid';

@Injectable()
export class FilesService {
  async filesSave(files: FilesInterface[], folder = '') {
    folder = folder.replace(/[^\w\d]/gu, '');
    const uploadFolder = join(
      __dirname,
      '..',
      '..',
      process.env.UPLOADS,
      folder,
    );

    try {
      await access(uploadFolder);
    } catch (e) {
      await mkdir(uploadFolder, { recursive: true });
    }

    const res: FilesInterface[] = await Promise.all(
      files.map(async (file): Promise<FilesInterface> => {
        if (!file) {
          return undefined;
        }

        try {
          await writeFile(join(uploadFolder, file.originalname), file.buffer);
        } catch (e) {
          throw new InternalServerErrorException('Ошибка при записи файла');
        }

        return {
          url: `/${process.env.UPLOADS}/${folder ? `${folder}/` : ''}${
            file.originalname
          }`,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        };
      }),
    );
    return res;
  }

  filesRename(file: FilesInterface, extension = undefined) {
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

  filesMaxSize(file: FilesInterface, maxSize = undefined) {
    const { size } = file;
    return !maxSize || size <= maxSize;
  }

  filesAllowTypes(file: FilesInterface, types = undefined) {
    if (!types) {
      return true;
    }
    if (typeof types === 'object') {
      types = types.join(';');
    }
    const mimetype = file.mimetype.split('/');
    return types.includes(mimetype[0]) || types.includes(mimetype[1]);
  }

  async filesIsImage(file: FilesInterface) {
    const { mimetype } = file;
    return mimetype.includes('image');
  }

  async filesImageMetadata(file: Buffer) {
    return await sharp(file).metadata();
  }

  async filesImageResize(file: Buffer, options) {
    return await sharp(file).resize(options).toBuffer();
  }

  async filesImageOversize(file: Buffer, options) {
    const { width, height } = await this.filesImageMetadata(file);
    if (width > height && width > options.width) {
      return await this.filesImageResize(file, { width: options.width });
    }
    if (height > options.height) {
      return await this.filesImageResize(file, { height: options.height });
    }
    return await sharp(file).toBuffer();
  }

  async convertToWebp(file: Buffer): Promise<Buffer> {
    return await sharp(file).webp().toBuffer();
  }

  async filesImageConvert(file: FilesInterface) {
    const { mimetype, originalname } = file;
    const type = mimetype.split('/')[1];

    const arrayname = originalname.split('.');
    arrayname.pop();
    const name = arrayname.join('.');

    let extension = 'svg';
    if (type !== 'svg+xml') {
      file.buffer = await this.convertToWebp(file.buffer);
      extension = 'webp';
    }

    const { size } = await this.filesImageMetadata(file.buffer);

    return new FilesInterface({
      buffer: file.buffer,
      originalname: `${name}.${extension}`,
      mimetype,
      size,
    });
  }
}
