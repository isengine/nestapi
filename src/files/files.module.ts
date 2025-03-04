import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FilesController } from '@src/files/files.controller';
import { FilesService } from '@src/files/files.service';

import { AllowTypesHandler } from './handler/allow_types.handler';
import { DecodeHandler } from './handler/decode.handler';
import { GetImageMetadataHandler } from './handler/get_image_metadata.handler';
import { ImageConvertHandler } from './handler/image_convert.handler';
import { ImageResizeHandler } from './handler/image_resize.handler';
import { IsImageHandler } from './handler/is_image.handler';
import { MaxSizeHandler } from './handler/max_size.handler';
import { PdfGenerateHandler } from './handler/pdf_generate.handler';
import { RenameHandler } from './handler/rename.handler';
import { SaveHandler } from './handler/save.handler';

@Module({
  controllers: [FilesController],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: process.env.UPLOADS_PATH,
      serveRoot: process.env.UPLOADS_PATH,
    }),
  ],
  providers: [
    FilesService,
    AllowTypesHandler,
    DecodeHandler,
    GetImageMetadataHandler,
    ImageConvertHandler,
    ImageResizeHandler,
    IsImageHandler,
    MaxSizeHandler,
    PdfGenerateHandler,
    RenameHandler,
    SaveHandler,
  ],
  exports: [FilesService, DecodeHandler],
})
export class FilesModule {}
