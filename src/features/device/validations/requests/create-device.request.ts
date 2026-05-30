import * as Joi from "joi";

export const createDeviceSchema = Joi.object({
  name: Joi.string().required(),
  wattage: Joi.number().integer().required(),
  category_id: Joi.number().required(),
  household_id: Joi.number().required(),
  is_active: Joi.boolean().optional().allow(null, ""),
});
