import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';
import { StripeWebhookDto } from './dto/stripe-webhook.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('stripe.secretKey') || '');
  }

  createSession(createPaymentSessionDto: CreatePaymentSessionDto) {
    const { currency, items } = createPaymentSessionDto;

    return this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {},
      },
      line_items: items.map((item) => ({
        price_data: {
          currency: currency,
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: this.configService.get('stripe.successUrl'),
      cancel_url: this.configService.get('stripe.cancelUrl'),
    });
  }

  stripeWebhook(stripeWebhookDto: StripeWebhookDto) {
    const { payload, signature } = stripeWebhookDto;
    if (!payload || !signature) {
      throw new BadRequestException('Payload and signature are required');
    }

    const endpointSecret =
      this.configService.get<string>('stripe.webhookSecret') || '';

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret,
      );
    } catch (err) {
      const message =
        err instanceof Stripe.errors.StripeSignatureVerificationError
          ? err.message
          : 'Unknown error occurred while creating webhook event';

      throw new BadRequestException(message);
    }

    return event;
  }
}
