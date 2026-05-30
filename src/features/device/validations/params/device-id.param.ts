import * as Joi from "joi";
import { Device } from "../../entities/device.entity";

export const deviceIdExternal = async (value) => {
  const device = await Device.findOne({
    where: { id: value },
  });

  if (!device) {
    throw new Joi.ValidationError(
      "any.invalid-device-id",
      [
        {
          message: "device not found",
          path: ["id"],
          type: "any.invalid-device-id",
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
  return device;
};

export const deviceIdParamSchema = Joi.number()
  .required()
  .external(deviceIdExternal);
