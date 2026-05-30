import * as Joi from "joi";
import { TariffClass } from "../../entities/tariff-class.entity";

export const tariffClassIdExternal = async (value) => {
  const tariffClass = await TariffClass.findOne({
    where: { id: value },
  });

  if (!tariffClass) {
    throw new Joi.ValidationError(
      "any.invalid-tariff-class-id",
      [
        {
          message: "tariff class not found",
          path: ["id"],
          type: "any.invalid-tariff-class-id",
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
  return tariffClass;
};

export const tariffClassIdParamSchema = Joi.number()
  .required()
  .external(tariffClassIdExternal);
