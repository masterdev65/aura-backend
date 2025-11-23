import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private databaseService: DatabaseService,
  ) {
    const stripeKey = this.configService.get<string>('stripe.secretKey');
    if (!stripeKey) {
      throw new Error('Stripe secret key is not configured');
    }
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2025-11-17.clover',
    });
  }

  async createPaymentIntent(appointmentId: string, amount: number) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          appointmentId,
        },
      });

      await this.databaseService.update('appointments', appointmentId, {
        stripePaymentIntentId: paymentIntent.id,
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      throw new BadRequestException('Payment intent creation failed');
    }
  }

  async confirmPayment(paymentIntentId: string) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const appointmentId = paymentIntent.metadata.appointmentId;
      await this.databaseService.update('appointments', appointmentId, {
        depositPaid: paymentIntent.amount / 100,
        paymentStatus: 'deposit_paid',
        status: 'confirmed',
      });

      return { success: true };
    }

    return { success: false };
  }

  async refundPayment(paymentIntentId: string, amount?: number) {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      return { success: true, refundId: refund.id };
    } catch (error) {
      throw new BadRequestException('Refund failed');
    }
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get<string>('stripe.webhookSecret');
    if (!webhookSecret) {
      throw new BadRequestException('Stripe webhook secret is not configured');
    }

    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.confirmPayment(event.data.object.id);
          break;

        case 'payment_intent.payment_failed':
          // Handle failed payment
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      throw new BadRequestException('Webhook signature verification failed');
    }
  }
}
