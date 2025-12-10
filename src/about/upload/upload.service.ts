import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  url: string;
}

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      if (!file) return reject('No file uploaded');

      const upload = cloudinary.uploader.upload_stream(
        { folder: 'about-section' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryResponse);
        },
      );

      const stream = Readable.from(file.buffer);
      stream.pipe(upload);
    });
  }
}
