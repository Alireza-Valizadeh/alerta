export enum PersianChassisStates {
  BothOk = 'هر دو سالم و پلمپ',
  BothNotOk = 'هر دو ضربه خورده',
  OnlyFrontOk = 'شاسی جلو سالم، شاسی عفب ضربه خورده',
  OnlyBackOk = 'شاسی جلو ضربه خورده، شاسی عفب سالم',
}
export enum PersianEngineStates {
  Ok = 'سالم',
  NeedsRepair = 'نیاز به تعمیر',
  Repaired = 'تعمیر شده',
}

export enum PersianBodyStates {
  Perfect = 'سالم و بی خط و خش',
  MinorIssues = 'خط و خش جزیی',
  OneColor = 'یک تکه رنگ',
  TwoColors = 'دو  تکه رنگ',
  ManyColors = 'چند تکه رنگ',
  NoColor = 'بدون رنگ',
  FullColor = 'تمام رنگ',
}

export enum PersianColors {
  Green = 'سبز',
  Red = 'قرمز',
  Yellow = 'زرد',
  Blue = 'آبی',
  Orange = 'نارنجی',
  Gray = 'نوک مدادی',
  Dolphin = 'دلفینی',
  Black = 'مشکی',
  White = 'سفید',
  CherryRed = 'آلبایویی',
  Silver = 'نقره ای',
  PureWhite = 'سفید صدفی',
}

export enum PersianFuelTypes {
  Diesel = 'دیزل',
  Petrol = 'بنزینی',
  Electric = 'برقی',
  Hybrid = 'هیبرید',
  ManualCng = 'دوگانه دستی',
  CompanyCng = 'دوگانه کارخانه',
}

export enum PersianGearboxes {
  Automatic = 'دنده ای',
  Manual = 'اتوماتیک',
}

export const PersianTranslations = {
  ChassisStates: PersianChassisStates,
  EngineStates: PersianEngineStates,
  BodyStates: PersianBodyStates,
  Colors: PersianColors,
  FuelTypes: PersianFuelTypes,
  Gearboxes: PersianGearboxes,
};
