import * as Joi from "joi";

export const updateDeviceCategorySchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional().allow(null, ""),
}).min(1);
