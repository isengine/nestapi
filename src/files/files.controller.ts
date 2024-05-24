import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Query,
  Param,
  Body,
  Res,
} from '@nestjs/common';
import { FilesService } from '@src/files/files.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesInterface } from '@src/files/files.interface';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('pdf/:template')
  async getPDF(
    @Param('template') template: string,
    @Body('data') data: object,
    @Body('options') options: object,
    @Res() res: any,
  ): Promise<void> {
    const buffer = await this.filesService.filesPdfGenerate(template, data, options);
    if (!buffer) {
      return;
    }
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=pdf.pdf`,
      'Content-Length': buffer.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });
    res.end(buffer);
  }

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
