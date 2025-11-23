import { Controller, Post, Body, Headers, Req, UseGuards, type RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-intent')
  @UseGuards(JwtAuthGuard)
  createPaymentIntent(
    @Body() body: { appointmentId: string; amount: number },
  ) {
    return this.paymentsService.createPaymentIntent(body.appointmentId, body.amount);
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    if (!request.rawBody) {
      throw new Error('Raw body is required for webhook validation');
    }
    return this.paymentsService.handleWebhook(signature, request.rawBody as Buffer);
  }
}
