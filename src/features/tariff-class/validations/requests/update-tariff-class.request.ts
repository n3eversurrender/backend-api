import * as Joi from "joi";

export const updateTariffClassSchema = Joi.object({
  code: Joi.string().optional(),
  type: Joi.string().optional(),
  voltage: Joi.string().optional(),
  capacity_va: Joi.number().optional(),
  price_per_kwh: Joi.number().optional(),
});
