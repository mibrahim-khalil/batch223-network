export const CUST_BATCH223_EMAIL_REGEX = /^bse223\d{3}@cust\.pk$/i;

export function assertBatch223Email(email: string) {
  const e = email.trim();
  if (!CUST_BATCH223_EMAIL_REGEX.test(e)) {
    const err: any = new Error("Only Batch223 emails like bse223XXX@cust.pk are allowed.");
    err.statusCode = 400;
    throw err;
  }
  return e.toLowerCase();
}