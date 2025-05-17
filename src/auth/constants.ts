export const jwtConstants = {
  secret: 'secret',
  expiresIn: '31d',
};

export enum Messages {
  INVALID_CODE = 'کد وارد شده اشتباه است',
  CODE_EXPIRED = 'کد شما منقضی شده است',
  PHONE_NOT_FOUND = 'شماره تلفن شما وجود ندارد',
  PHONE_ALREADY_REGISTERED = 'شماره تلفن شما قبلا ثبت شده است',
}
