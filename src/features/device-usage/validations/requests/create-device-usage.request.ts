import * as Joi from "joi";

export const createDeviceUsageSchema = Joi.object({
  usage_date: Joi.string().required(),
  usage_hours: Joi.number().required(),
});
