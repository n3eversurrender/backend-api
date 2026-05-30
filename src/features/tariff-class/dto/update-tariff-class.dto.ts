import { PartialType } from '@nestjs/mapped-types';
import { CreateTariffClassDto } from './create-tariff-class.dto';

export class UpdateTariffClassDto extends PartialType(CreateTariffClassDto) {}
