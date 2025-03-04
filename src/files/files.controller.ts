import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiExcludeController } from '@nestjs/swagger';
import { Multer } from 'multer';
import { Data } from '@src/common/common.decorator';
import { FilesService } from './files.service';
import { OptionsFilesDto } from './dto/options.files.dto';

@ApiExcludeController()
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('file'))
  async filesUploadImage(
    @UploadedFiles() files: Express.Multer.File[],
    @Data('options') options?: OptionsFilesDto,
  ) {
    return await this.filesService.process(files, options);
  }
}
