import * as Joi from "joi";
import { DeviceCategory } from "../../entities/device-category.entity";

export const deviceCategoryIdExternal = async (value) => {
  const deviceCategory = await DeviceCategory.findOne({
    where: { id: value },
  });

  if (!deviceCategory) {
    throw new Joi.ValidationError(
      "any.invalid-device-category-id",
      [
        {
          message: "device category not found",
          path: ["id"],
          type: "any.invalid-device-category-id",
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
  return deviceCategory;
};

export const deviceCategoryIdParamSchema = Joi.number()
  .required()
  .external(deviceCategoryIdExternal);
