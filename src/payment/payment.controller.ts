import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('create-intent')
  async createIntent(@Body() body: { amount: number }) {
    return this.paymentService.createPaymentIntent(body.amount);
  }

  @Post('confirm')
  async confirmPayment(
    @Body() body: { orderId: string }
  ) {
    return this.paymentService.markOrderAsPaid(body.orderId);
  }

}
