import * as Joi from "joi";

export const createDeviceCategorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional().allow(null, ""),
});
