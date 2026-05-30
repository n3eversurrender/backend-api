import * as Joi from "joi";

export const changePasswordSchema = Joi.object({
  old_password: Joi.string().min(8).required(),
  new_password: Joi.string().min(8).required(),
  new_password_confirmation: Joi.string()
    .valid(Joi.ref("new_password"))
    .required()
    .messages({ "any.only": "New password confirmation does not match" }),
});
