import { Injectable } from '@nestjs/common';
import { access, mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { FilesInterface } from '../files.interface';
import { OptionsFilesDto } from '../dto/options.files.dto';

@Injectable()
export class SaveHandler {
  async save(file: FilesInterface, options: OptionsFilesDto) {
    let { folder } = options;
    const { replace } = options;

    folder = `${folder || ''}`.replace(/[^\w\d\/]/gu, '');
    const uploadFolder = join(process.env.UPLOADS_PATH, folder);

    try {
      await access(uploadFolder);
    } catch (e) {
      await mkdir(uploadFolder, { recursive: true });
    }

    if (!file) {
      return {
        error: 'Файл не задан',
      };
    }

    const filePath = join(uploadFolder, file.originalname);

    if (!replace && existsSync(filePath)) {
      return {
        error: 'Файл уже существует',
      };
    }

    try {
      await writeFile(filePath, file.buffer);
    } catch (e) {
      return {
        error: 'Ошибка при записи файла',
      };
    }

    return {
      url: `${process.env.UPLOADS_URL}/${folder ? `${folder}/` : ''}${
        file.originalname
      }`,
    };
  }
}
