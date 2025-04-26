export enum PersianChassisStates {
  BothOk = 'هر دو سالم و پلمپ',
  BothNotOk = 'هر دو ضربه خورده',
  OnlyFrontOk = 'شاسی جلو سالم، شاسی عفب ضربه خورده',
  OnlyBackOk = 'شاسی جلو ضربه خورده، شاسی عفب سالم',
}

export const PersianTranslations = {
  ChassisState: PersianChassisStates,
};
