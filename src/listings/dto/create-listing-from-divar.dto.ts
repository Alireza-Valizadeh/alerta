export class createListingFromDivarDto {
  title: string;
  mileage: string;
  price: string;
  vdpUrl: string;
  isNardeban: boolean;
  details: {
    description: string;
    year: string;
    makeModel: string;
    color: string;
    mileage: string;
    fuelType: string;
    engineState: string;
    bodyState: string;
    chassisState: string;
  };
}
