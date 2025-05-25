import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  createSession() {
    return 'createSession';
  }

  webhook() {
    return 'webhook';
  }
}
