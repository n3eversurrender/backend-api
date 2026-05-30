import * as Joi from "joi";
import { DeviceUsage } from "../../entities/device-usage.entity";

export const deviceUsageIdExternal = async (value) => {
  const deviceUsage = await DeviceUsage.findOne({
    where: { id: value.id, device_id: value.deviceId },
  });

  if (!deviceUsage) {
    throw new Joi.ValidationError(
      "any.invalid-device-usage-id",
      [
        {
          message: "Device usage not found",
          path: ["id"],
          type: "any.invalid-device-usage-id",
          context: {
            key: "id",
            label: "id",
            value,
          },
        },
      ],
      value
    );
  }
  return deviceUsage;
};

export const deviceUsageIdParamSchema = Joi.object()
  .required()
  .external(deviceUsageIdExternal);
