// create static method to handle Joi exception
import * as Joi from "joi";

export class JoiException {
  static handle(message: string, helper: Joi.ExternalHelpers) {
    const key = helper.state.path.reduce<string>((acc, key) => {
      if (typeof key === "string") {
        return acc + key;
      } else {
        return acc + `[${key}]`;
      }
    }, "");

    throw new Joi.ValidationError(
      "any.email-exists",
      [
        {
          message: message,
          path: helper.state.path,
          type: "any.invalid",
          context: {
            key: key,
            label: key,
          },
        },
      ],
      helper.original,
    );
  }
}
