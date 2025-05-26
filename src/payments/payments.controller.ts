import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-session')
  createSession(@Body() createPaymentSessionDto: CreatePaymentSessionDto) {
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

  @Post('webhook')
  webhook() {
    return this.paymentsService.webhook();
  }
}
