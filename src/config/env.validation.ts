import * as Joi from 'joi';

export default Joi.object({
  PORT: Joi.number().required(),
  STRIPE_SECRET_KEY: Joi.string().required(),
}).unknown(true);
