import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';
import { StripeWebhookDto } from './dto/stripe-webhook.dto';
import { PaymentSessionSummaryDto } from './dto/payment-session-summary.dto';
import { NATS_SERVICE } from 'src/config/microservices.token';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private configService: ConfigService,
    @Inject(NATS_SERVICE) private clientProxy: ClientProxy,
  ) {
    this.stripe = new Stripe(this.configService.get('stripe.secretKey') || '');
  }

  createSession(
    createPaymentSessionDto: CreatePaymentSessionDto,
  ): Promise<PaymentSessionSummaryDto> {
    const { orderId, currency, items } = createPaymentSessionDto;

    return this.stripe.checkout.sessions
      .create({
        payment_intent_data: {
          metadata: {
            orderId,
          },
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
      })
      .then((session) => ({
        successUrl: session.success_url,
        cancelUrl: session.cancel_url,
        paymentUrl: session.url,
      }));
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

    switch (event.type) {
      case 'charge.succeeded':
        this.clientProxy.emit('payments.succeeded', {
          orderId: event.data.object.metadata.orderId,
          externalId: event.data.object.id,
          receiptUrl: event.data.object.receipt_url,
        });
        break;
      default:
        this.logger.warn(`Unhandled event type: ${event.type}`);
    }
  }
}
