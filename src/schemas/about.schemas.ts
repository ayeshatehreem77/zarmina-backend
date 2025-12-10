import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AboutDocument = About & Document;

@Schema({ timestamps: true })
export class About {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  imageUrl: string;
}

export const AboutSchema = SchemaFactory.createForClass(About);
