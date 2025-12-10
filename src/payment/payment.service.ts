import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from 'src/schemas/orders.schemas';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,  // ← inject Order model
  ) {
    const secret = "sk_test_51QUPsXCLV3yZuvjxSpqHQbfrRgTRuvYJQfNbPzdHgIPUeNhHGguup4R0qrjslYZkCSFogtraYlZaRkwIboPkxmTN00QPSFFh9p";  
    this.stripe = new Stripe(secret);
  }

  async createPaymentIntent(amount: number) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
    });
    return { clientSecret: paymentIntent.client_secret };
  }

  async markOrderAsPaid(orderId: string) {
    const order = await this.orderModel.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: 'paid'
      },
      { new: true },
    );
    return order;
  }
}
