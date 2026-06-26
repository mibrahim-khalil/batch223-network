export const ADMIN_EMAILS = [
  "bse223000@cust.pk",
  "bse223001@cust.pk",
];

export function isAdminEmail(email: string) {
  const e = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((x) => x.toLowerCase() === e);
}