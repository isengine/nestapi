import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { FilesService } from '@src/files/files.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesInterface } from './files.interface';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('file'))
  async filesUploadImage(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ) {
    const filesList = await Promise.all(
      files.map(async (item) => {
        const file = new FilesInterface(item);

        const fileSize = this.filesService.filesMaxSize(file, 3 * 1024 * 1024);
        const allowType = this.filesService.filesAllowTypes(file, 'image');

        if (!fileSize || !allowType) {
          return undefined;
        }

        const isImage = this.filesService.filesIsImage(file);
        if (isImage) {
          file.buffer = await this.filesService.filesImageOversize(
            file.buffer,
            {
              width: 3840,
              height: 2160,
            },
          );

          const converted = await this.filesService.filesImageConvert(file);

          file.buffer = converted.buffer;
          file.originalname = converted.originalname;
          file.mimetype = converted.mimetype;
          file.size = converted.size;
        }
        return await this.filesService.filesRename(file);
      }),
    );
    return this.filesService.filesSave(filesList, folder);
  }
}
