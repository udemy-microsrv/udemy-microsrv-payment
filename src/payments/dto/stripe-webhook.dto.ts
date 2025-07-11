export class StripeWebhookDto {
  payload?: Buffer<ArrayBufferLike>;
  signature: string;
}
