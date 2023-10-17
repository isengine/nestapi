export class FilesInterface {
  buffer?: Buffer;
  originalname: string;
  mimetype: string;
  url?: string;
  size?: number;

  width?: number;
  height?: number;

  constructor(file: Express.Multer.File | FilesInterface) {
    this.buffer = file.buffer;
    this.originalname = file.originalname;
    this.mimetype = file.mimetype;
    this.size = file.size;
  }
}
