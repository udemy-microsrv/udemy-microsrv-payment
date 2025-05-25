import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly stripe: any;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('stripe.secretKey') || '');
  }

  createSession() {
    return 'createSession';
  }

  webhook() {
    return 'webhook';
  }
}
