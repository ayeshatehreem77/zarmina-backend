import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { About, AboutSchema } from 'src/schemas/about.schemas';
import { AboutService } from './about.service';
import { AboutController } from './about.controller';
import { UploadService } from './upload/upload.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: About.name, schema: AboutSchema }]),
    CloudinaryModule,
  ],
  controllers: [AboutController],
  providers: [AboutService, UploadService],
})
export class AboutModule {}
