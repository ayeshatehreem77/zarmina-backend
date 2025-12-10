import { Controller, Get, Put, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AboutService } from './about.service';
import { UploadService } from './upload/upload.service';

@Controller('about')
export class AboutController {
  constructor(
    private aboutService: AboutService,
    private uploadService: UploadService,
  ) {}

  @Get()
  getAbout() {
    return this.aboutService.getAbout();
  }

  @Put('update-with-image')
  @UseInterceptors(FileInterceptor('image'))
  async updateWithImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
  ) {
    let imageUrl = body.imageUrl;

    if (file) {
      const uploaded = await this.uploadService.uploadImage(file);
      imageUrl = uploaded.secure_url;
    }

    return this.aboutService.updateAbout({
      title: body.title,
      description: body.description,
      imageUrl,
    });
  }
}
