export function validateThaiCitizenId(idStr) {
  const cleanId = (idStr || '').replace(/\D/g, '');
  if (cleanId.length !== 13) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanId.charAt(i), 10) * (13 - i);
  }
  const checkDigit = (11 - (sum % 11)) % 10;
  return checkDigit === parseInt(cleanId.charAt(12), 10);
}

export function formatThaiId(val) {
  const digits = (val || '').replace(/\D/g, '').substring(0, 13);
  const parts = [];
  if (digits.length > 0) parts.push(digits.substring(0, 1));
  if (digits.length > 1) parts.push(digits.substring(1, 5));
  if (digits.length > 5) parts.push(digits.substring(5, 10));
  if (digits.length > 10) parts.push(digits.substring(10, 12));
  if (digits.length > 12) parts.push(digits.substring(12, 13));
  return parts.join('-');
}
