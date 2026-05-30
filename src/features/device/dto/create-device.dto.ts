export class CreateDeviceDto {
  name: string;
  wattage: number;
  category_id: number;
  household_id: number;
  is_active?: boolean;
}
