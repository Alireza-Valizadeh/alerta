export enum PersianGeneralStatements {
  Undefined = 'تعیین‌نشده',
  NewSmsCost = 'ارسال پیامک برای آگهی جدید',
  SignUpBonus = 'اعتبار هدیه ثبت نام',
}

export enum PersianChassisStates {
  BothOk = 'سالم و پلمپ',
  BothNotOk = 'ضربه‌خورده',
  BothHasColor = 'رنگ‌شده',
  OnlyFrontOk = 'شاسی جلو سالم، شاسی عفب ضربه خورده',
  OnlyBackOk = 'شاسی جلو ضربه خورده، شاسی عفب سالم',
}

export enum PersianEngineStates {
  Ok = 'سالم',
  NeedsRepair = 'نیاز به تعمیر',
  Repaired = 'تعویض شده',
}

export enum PersianBodyStates {
  Perfect = 'سالم و بی‌خط و خش',
  MinorIssues = 'خط و خش جزیی',
  PDR = 'صافکاری بی‌رنگ',
  HasColor = 'رنگ‌شدگی',
  FullColorWithoutRoof = 'دوررنگ',
  FullColor = 'تمام‌رنگ',
  Accident = 'تصادفی',
  Recycle = 'اوراقی',
}

export enum PersianColors {
  Blue = 'آبی',
  Albaloei = 'آلبالویی',
  Atlasi = 'اطلسی',
  Bademjani = 'بادمجانی',
  Bronze = 'برنز',
  Beige = 'بژ',
  Purple = 'بنفش',
  PustPiazi = 'پوست\u200cپیازی',
  Titanium = 'تیتانیوم',
  Gray = 'خاکستری',
  Khaki = 'خاکی',
  Dolphin = 'دلفینی',
  Charcoal = 'ذغالی',
  Yellow = 'زرد',
  Zereshki = 'زرشکی',
  Olive = 'زیتونی',
  Green = 'سبز',
  Lead = 'سربی',
  Navy = 'سرمه\u200cای',
  White = 'سفید',
  WhiteShell = 'سفید صدفی',
  Golden = 'طلایی',
  Taupe = 'طوسی',
  Lentil = 'عدسی',
  Annaby = 'عنابی',
  Red = 'قرمز',
  Brown = 'قهوه\u200cای',
  CarbonBlack = 'کربن\u200cبلک',
  Cream = 'کرم',
  Cherry = 'گیلاسی',
  Copper = 'مسی',
  Black = 'مشکی',
  Mocha = 'موکا',
  Orange = 'نارنجی',
  SilverBlue = 'نقرآبی',
  Silver = 'نقره\u200cای',
  PencilGray = 'نوک\u200cمدادی',
  Jade = 'یشمی',
  Other = 'سایر',
}

export enum PersianFuelTypes {
  Petrol = 'بنزینی',
  CompanyCng = 'دوگانه‌سوز شرکتی',
  ManualCng = 'دوگانه‌سوز دستی',
  Diesel = 'گازوئیل',
  Electric = 'برقی',
  Hybrid = 'هیبرید',
}

export enum PersianGearboxes {
  Manual = 'دنده‌ای',
  Automatic = 'اتوماتیک',
}

export const PersianTranslations = {
  ChassisStates: PersianChassisStates,
  EngineStates: PersianEngineStates,
  BodyStates: PersianBodyStates,
  Colors: PersianColors,
  FuelTypes: PersianFuelTypes,
  Gearboxes: PersianGearboxes,
  GeneralStatements: PersianGeneralStatements,
};
