import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FilesController } from '@src/files/files.controller';
import { FilesService } from '@src/files/files.service';
import { join } from 'path';

@Module({
  controllers: [FilesController],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', `${process.env.UPLOADS}`),
      serveRoot: `/${process.env.UPLOADS}`,
    }),
  ],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
