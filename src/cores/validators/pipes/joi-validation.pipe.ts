import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: Joi.ObjectSchema) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      return await this.schema.validateAsync(value, {
        abortEarly: false,
      });
    } catch (error) {
      if (typeof error.details !== "undefined") {
        throw new UnprocessableEntityException(error);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }
}
