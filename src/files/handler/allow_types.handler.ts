import { Injectable } from '@nestjs/common';
import { FilesInterface } from '@src/files/files.interface';

@Injectable()
export class AllowTypesHandler {
  allowTypes(file: FilesInterface) {
    let types = process.env.UPLOADS_ALLOW_TYPES || '';
    if (!types) {
      return true;
    }
    if (Array.isArray(types)) {
      types = types.join(';');
    }
    const mimetype = file.mimetype.split('/');
    return types.includes(mimetype[0]) || types.includes(mimetype[1]);
  }
}
