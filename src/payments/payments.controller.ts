import { Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-session')
  createSession() {
    return this.paymentsService.createSession();
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

  @Post('webhook')
  webhook() {
    return this.paymentsService.webhook();
  }
}
