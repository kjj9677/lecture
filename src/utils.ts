export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  if (password.length < 6 || password.length > 10) return false;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasLetter && hasNumber;
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^010-\d{4}-\d{4}$/;
  return phoneRegex.test(phone);
};

export const formatPhoneNumber = (value: string): string => {
  // 숫자만 추출
  const numbers = value.replace(/[^\d]/g, "");

  // 최대 11자리까지만 허용
  const limitedNumbers = numbers.slice(0, 11);

  // 자동 하이픈 삽입
  if (limitedNumbers.length <= 3) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 7) {
    return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
  } else {
    return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7)}`;
  }
};

export const formatPrice = (price: number, withUnit: boolean = false): string => {
  const formatted = new Intl.NumberFormat("ko-KR").format(price);
  return withUnit ? `${formatted}원` : formatted;
};
