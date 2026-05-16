export const ORDER_STATUS_ALIAS_MAP: Record<string, string> = {
  pending: "created",
  confirmed: "created",
  "in-progress": "processing",
  returned: "cancelled",
};

export const ORDER_ITEM_STATUS_ALIAS_MAP: Record<string, string> = {
  pending: "processing",
  "in-progress": "processing",
};

export const ORDER_STATUS_META: Record<
  string,
  { label: string; colorScheme: string; dot: string }
> = {
  initialized: { label: "Draft", colorScheme: "gray", dot: "gray.500" },
  created: { label: "Placed", colorScheme: "blue", dot: "blue.500" },
  processing: { label: "Processing", colorScheme: "orange", dot: "orange.500" },
  shipped: { label: "Shipped", colorScheme: "purple", dot: "purple.500" },
  delivered: { label: "Delivered", colorScheme: "green", dot: "green.500" },
  cancelled: { label: "Cancelled", colorScheme: "red", dot: "red.500" },
};

export const COMPANY_ORDER_FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "created", label: "Placed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
] as const;

export const COMPANY_ORDER_STATUS_QUERY_MAP: Record<string, string[]> = {
  all: [],
  created: ["created"],
  processing: ["processing"],
  shipped: ["shipped"],
  delivered: ["delivered"],
  cancelled: ["cancelled"],
};

export const ORDER_ITEM_STATUS_OPTIONS = [
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export const normalizeOrderStatusKey = (status?: string) => {
  const normalized = String(status || "").trim().toLowerCase();
  if (!normalized) {
    return "";
  }

  return ORDER_STATUS_ALIAS_MAP[normalized] || normalized;
};

export const normalizeOrderItemStatusKey = (status?: string) => {
  const normalized = String(status || "").trim().toLowerCase();
  if (!normalized) {
    return "";
  }

  return ORDER_ITEM_STATUS_ALIAS_MAP[normalized] || normalized;
};

export const getOrderStatusMeta = (status?: string) => {
  const normalized = normalizeOrderStatusKey(status);
  return (
    ORDER_STATUS_META[normalized] || {
      label: status || "Unknown",
      colorScheme: "gray",
      dot: "gray.500",
    }
  );
};
