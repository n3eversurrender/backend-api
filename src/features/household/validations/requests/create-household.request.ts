import * as Joi from "joi";

export const createHouseholdSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  tariff_class_id: Joi.number().required(),
});
