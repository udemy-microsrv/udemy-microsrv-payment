import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';
import { StripeWebhookDto } from './dto/stripe-webhook.dto';
import { Request } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('payments.create_session')
  createSession(@Payload() createPaymentSessionDto: CreatePaymentSessionDto) {
    return this.paymentsService.createSession(createPaymentSessionDto);
  }

  @Get('successful')
  successful() {
    return {
      success: true,
      message: 'Payment successful',
    };
  }

  @Get('canceled')
  canceled() {
    return {
      success: false,
      message: 'Payment canceled',
    };
  }

  @Post('stripe-webhook')
  @HttpCode(HttpStatus.OK)
  stripeWebhook(@Req() request: RawBodyRequest<Request>) {
    const stripeWebhookDto: StripeWebhookDto = {
      payload: request.rawBody,
      signature: request.headers['stripe-signature'] as string,
    };

    this.paymentsService.stripeWebhook(stripeWebhookDto);
  }
}
