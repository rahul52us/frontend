// Mock wallet data
export const walletBalance = 250.75;
export const transactions = [
  {
    id: 1,
    type: "credit",
    amount: 50.0,
    date: "March 18, 2023",
    description: "Refund for Order #ORD-12342",
  },
  {
    id: 2,
    type: "debit",
    amount: 89.99,
    date: "March 15, 2023",
    description: "Payment for Order #ORD-12345",
  },
  {
    id: 3,
    type: "credit",
    amount: 100.0,
    date: "March 10, 2023",
    description: "Added funds",
  },
];

export const paymentMethods = [
  {
    id: 1,
    type: "Visa",
    last4: "4242",
    expiry: "04/25",
    isDefault: true,
  },
  {
    id: 2,
    type: "Mastercard",
    last4: "5555",
    expiry: "08/24",
    isDefault: false,
  },
];
