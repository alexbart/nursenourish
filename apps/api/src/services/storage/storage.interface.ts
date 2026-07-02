export interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export interface StorageProvider {
  upload(file: UploadedFile): Promise<string>;
  delete(url: string): Promise<void>;
}
