import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { About, AboutDocument } from 'src/schemas/about.schemas';

@Injectable()
export class AboutService {
  constructor(
    @InjectModel(About.name) private aboutModel: Model<AboutDocument>,
  ) {}

  async getAbout() {
    return this.aboutModel.findOne();
  }

  async updateAbout(dto) {
    return this.aboutModel.findOneAndUpdate({}, dto, {
      new: true,
      upsert: true,
    });
  }
}
