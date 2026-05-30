import * as Joi from "joi";

export const updateDeviceSchema = Joi.object({
  name: Joi.string().optional(),
  wattage: Joi.number().integer().optional(),
  category_id: Joi.number().optional(),
  household_id: Joi.number().optional(),
  is_active: Joi.boolean().optional().allow(null, ""),
});
