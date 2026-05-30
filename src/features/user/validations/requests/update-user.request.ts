import * as Joi from "joi";
import { getUserRoleEnums } from "../../enums/user-role.enum";

const userRoleEnum = getUserRoleEnums().map((value) => +value.id);

export const updateUserSchema = Joi.object({
  name: Joi.string().required(),
  role: Joi.number()
    .optional()
    .default(0)
    .valid(...userRoleEnum),
  is_active: Joi.boolean().optional().default(true),
});
