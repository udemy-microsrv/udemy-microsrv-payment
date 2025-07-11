export default () => ({
  app: {
    port: parseInt(process.env.PORT ?? '3001', 10),
  },
  transport: {
    nats: {
      servers: process.env.NATS_SERVERS?.split(','),
    },
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    successUrl: process.env.STRIPE_SUCCESS_URL,
    cancelUrl: process.env.STRIPE_CANCEL_URL,
    endpointSecret: process.env.STRIPE_ENDPOINT_SECRET,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
});
