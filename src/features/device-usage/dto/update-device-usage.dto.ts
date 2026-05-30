import { PartialType } from '@nestjs/mapped-types';
import { CreateDeviceUsageDto } from './create-device-usage.dto';

export class UpdateDeviceUsageDto extends PartialType(CreateDeviceUsageDto) {}
