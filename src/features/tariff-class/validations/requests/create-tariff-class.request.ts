import * as Joi from "joi";

export const createTariffClassSchema = Joi.object({
  code: Joi.string().required(),
  type: Joi.string().required(),
  voltage: Joi.string().required(),
  capacity_va: Joi.number().required(),
  price_per_kwh: Joi.number().required(),
});
