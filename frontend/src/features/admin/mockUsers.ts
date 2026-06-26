export type AdminUserRow = {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  suspended: boolean;
};

export const mockUsers: AdminUserRow[] = [
  { id: "u1", email: "bse223182@cust.pk", name: "Awais Khan", verified: true, suspended: false },
  { id: "u2", email: "bse223091@cust.pk", name: "Fatima Noor", verified: true, suspended: false },
  { id: "u3", email: "bse223144@cust.pk", name: "Hamza Ali", verified: false, suspended: false },
  { id: "u4", email: "bse223203@cust.pk", name: "Hira Ahmed", verified: true, suspended: false },
];