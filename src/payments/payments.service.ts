import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';

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

  webhook() {
    return 'webhook';
  }
}
