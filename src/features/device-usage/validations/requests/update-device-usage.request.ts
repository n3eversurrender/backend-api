import * as Joi from "joi";

export const updateDeviceUsageSchema = Joi.object({
  usage_date: Joi.string().optional(),
  usage_hours: Joi.number().optional(),
});
