import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type PaymentDocument = Payment & Document;


@Schema({ timestamps: true })
export class Payment {
@Prop({ type: Types.ObjectId, ref: 'Order', required: false })
orderId?: Types.ObjectId;


@Prop({ type: Types.ObjectId, ref: 'User', required: false })
userId?: Types.ObjectId;


@Prop({ required: true })
amount: number;


@Prop({ default: 'PKR' })
currency: string;


@Prop({ required: true, enum: ['stripe', 'easypaisa', 'jazzcash'] })
gateway: string;


@Prop({ required: true, enum: ['pending', 'paid', 'failed', 'refunded'] , default: 'pending'})
status: string;

@Prop({
  enum: ['card', 'cod'],
  default: 'card'
})
paymentMethod: string;


@Prop()
gatewayResponse?: any;


@Prop()
transactionRef?: string;
}


export const PaymentSchema = SchemaFactory.createForClass(Payment);