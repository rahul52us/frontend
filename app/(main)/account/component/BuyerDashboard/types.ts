export type SellerShop = {
  _id: string;
  name: string;
  logo: string | null;
  city: string | null;
  state: string | null;
  phone: string | null;
};

export type SellerConnection = {
  profileId: string;
  partyType: "customer" | "supplier";
  sellerShop: SellerShop | null;
  displayName: string | null;
  outstandingBalance: number;
  isBlocked: boolean;
  lastPurchaseAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type ConnectionSummary = {
  totalSellers: number;
  totalOutstanding: number;
  totalPayable: number;
};

export type SpendingChartPoint = {
  label: string;
  totalSpent: number;
  orderCount: number;
};

export type BuyerStats = {
  totalOrders: number;
  activeOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  connectedSellersCount: number;
  totalOutstanding: number;
  totalPayable: number;
  wishlistCount: number;
  walletBalance: number;
};

export type RecentOrder = {
  _id: string;
  orderId: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  totalItems: number;
  createdAt: string;
  companyName: string;
  companyLogo: string | null;
  firstItem: {
    name: string;
    image: string;
    quantity: number;
  } | null;
};

export type SellerPurchaseItem = {
  itemName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  lineTotal: number;
};

export type SellerPurchaseRecord = {
  _id: string;
  saleDate: string | null;
  grandTotal: number;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  status: "draft" | "posted" | "void";
  notes: string;
  postedAt: string | null;
  createdAt: string | null;
  itemCount: number;
  totalQuantity: number;
  items: SellerPurchaseItem[];
};

export type SellerPurchaseDetailsSummary = {
  totalRecords: number;
  totalSpent: number;
  totalLineItems: number;
  totalQuantity: number;
  lastPurchaseAt: string | null;
  shownRecords: number;
};

export type SellerPurchaseDetails = {
  profileId: string;
  partyType: "customer" | "supplier";
  sellerShop: SellerShop | null;
  displayName: string | null;
  summary: SellerPurchaseDetailsSummary;
  records: SellerPurchaseRecord[];
};

