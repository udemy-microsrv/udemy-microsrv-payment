import * as Joi from 'joi';

export default Joi.object({
  PORT: Joi.number().required(),
  STRIPE_SECRET_KEY: Joi.string().required(),
  STRIPE_SUCCESS_URL: Joi.string().required(),
  STRIPE_CANCEL_URL: Joi.string().required(),
  STRIPE_WEBHOOK_SECRET: Joi.string().required(),
  NATS_SERVERS: Joi.string().required(),
}).unknown(true);
