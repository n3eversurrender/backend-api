export class CreateTariffClassDto {
  code: string;
  type: string;
  voltage: string;
  capacity_va: number;
  price_per_kwh: number;
}
