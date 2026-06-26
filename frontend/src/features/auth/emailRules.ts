export function isBatch223Email(email: string) {
  const e = email.trim().toLowerCase();
  return /^bse223\d+@cust\.pk$/.test(e);
}

export function isBatch223RegNo(regNo: string) {
  return /^(b?se223)/i.test(regNo.trim());
}