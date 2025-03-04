export class FilesInterface {
  buffer?: Buffer;

  error?: string;

  mimetype: string;

  originalname: string;

  size?: number;

  timestamp?: Date;

  url?: string;

  width?: number;

  height?: number;

  constructor(file: Express.Multer.File | FilesInterface) {
    this.buffer = file.buffer;
    this.mimetype = file.mimetype;
    this.originalname = file.originalname;
    this.size = file.size;
    this.timestamp = new Date();
  }
}
