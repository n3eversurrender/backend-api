import * as Joi from "joi";
import { Household } from "../../entities/household.entity";

export const householdIdExternal = async (value: number) => {
  const household = await Household.findOne({
    where: { id: value },
  });

  if (!household) {
    throw new Joi.ValidationError(
      "any.invalid-household-id",
      [
        {
          message: "Household not found",
          path: ["id"],
          type: "any.invalid-household-id",
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
  return household;
};

export const householdIdParamSchema = Joi.number()
  .required()
  .external(householdIdExternal);
