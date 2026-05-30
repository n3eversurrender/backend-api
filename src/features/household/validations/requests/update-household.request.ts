import * as Joi from "joi";

export const updateHouseholdSchema = Joi.object({
  name: Joi.string().optional(),
  address: Joi.string().optional(),
  tariff_class_id: Joi.number().optional(),
});
