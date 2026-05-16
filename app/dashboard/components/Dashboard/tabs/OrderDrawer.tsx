import {
  Badge,
  Box,
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  Image,
  Select,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useState } from "react";
import {
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiDollarSign,
  FiGift,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiPrinter,
  FiTruck,
  FiX,
} from "react-icons/fi";
import stores from "../../../../store/stores";
import {
  getOrderStatusMeta,
  normalizeOrderItemStatusKey,
  normalizeOrderStatusKey,
  ORDER_ITEM_STATUS_OPTIONS,
} from "../../../../utils/orderStatus";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

const flow = ["created", "processing", "shipped", "delivered"];
const selectableStatuses = ["created", "processing", "shipped", "delivered", "cancelled"];
const normalizeFulfillmentStatus = (status?: string) =>
  ORDER_ITEM_STATUS_OPTIONS.some((option) => option.value === normalizeOrderItemStatusKey(status))
    ? normalizeOrderItemStatusKey(status)
    : "processing";

const fmt = (amount: any) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const formatPrintableDateTime = (value?: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return format(date, "d MMM yyyy, h:mm a");
};

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const cleanItemName = (name?: string) =>
  String(name || "")
    .replace(/^\[FREE\]\s*/i, "")
    .replace(/\s*\(Freebie\)\s*$/i, "")
    .trim();

const truncateWords = (value: string, maxWords: number = 10) => {
  const words = String(value || "").split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) {
    return words.join(" ");
  }

  return `${words.slice(0, maxWords).join(" ")}...`;
};

const getOrderItemHistoryLabel = (order: any, itemKey: string) => {
  const items = Array.isArray(order?.items) ? order.items : [];
  const matchedItem = items.find(
    (item: any) =>
      String(item?.fulfillment_id || "") === String(itemKey) ||
      String(item?.item_id || "") === String(itemKey) ||
      String(item?.productId || "") === String(itemKey),
  );

  return truncateWords(cleanItemName(matchedItem?.productName || ""), 10) || "Item";
};

const parseHistoryStatus = (order: any, status: string) => {
  const rawStatus = String(status || "").trim();
  const legacyItemMatch = rawStatus.match(
    /^Item\s+(.+)\s+(pending|in-progress|processing|shipped|delivered|cancelled)$/i,
  );
  const namedItemMatch = rawStatus.match(
    /^(.+?)\s+marked\s+(processing|shipped|delivered|cancelled)$/i,
  );

  if (legacyItemMatch) {
    const [, itemKey, itemStatus] = legacyItemMatch;
    const normalizedItemStatus = normalizeFulfillmentStatus(itemStatus);
    return {
      title: getOrderItemHistoryLabel(order, itemKey),
      status: normalizedItemStatus,
      isItemStatus: true,
    };
  }

  if (namedItemMatch) {
    const [, itemLabel, itemStatus] = namedItemMatch;
    return {
      title: truncateWords(cleanItemName(itemLabel), 10) || "Item",
      status: normalizeFulfillmentStatus(itemStatus),
      isItemStatus: true,
    };
  }

  return {
    title: rawStatus,
    status: "",
    isItemStatus: false,
  };
};

const buildOrderInvoiceHtml = ({
  order,
  companyName,
  addressStr,
  totalValue,
  taxValue,
  isOnline,
  isPaid,
}: {
  order: any;
  companyName: string;
  addressStr: string;
  totalValue: number;
  taxValue: number;
  isOnline: boolean;
  isPaid: boolean;
}) => {
  const items = Array.isArray(order?.items) ? order.items : [];
  const normalizedItems = items.map((item: any) => {
    const quantity = Number(item?.quantity || 0);
    const unitPrice = Number(item?.unitPrice || 0);
    const isFreebie = unitPrice === 0 || String(item?.productName || "").startsWith("[FREE]");
    const lineTotal = isFreebie ? 0 : quantity * unitPrice;

    return {
      name: cleanItemName(item?.productName) || "Unnamed item",
      quantity,
      unitPrice,
      lineTotal,
      isFreebie,
    };
  });

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const customerName = order?.user?.name || "Unknown";
  const customerPhone = order?.user?.phone || "-";
  const orderDate = formatPrintableDateTime(order?.createdAt);
  const paymentMethod = isOnline ? "Online" : order?.paymentMethod || "COD";
  const paymentState = isPaid ? "Paid" : "Pending";
  const shopTitle = companyName || "Store";
  const grandTotal = Number.isFinite(totalValue) ? totalValue : subtotal + taxValue;
  const statusLabel = getOrderStatusMeta(order?.orderStatus).label;

  const itemsRows = normalizedItems.length
    ? normalizedItems
        .map(
          (item, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${escapeHtml(item.name)}${item.isFreebie ? ' <span class="badge">FREE</span>' : ""}</td>
              <td class="right">${escapeHtml(item.quantity)}</td>
              <td class="right">${item.isFreebie ? "FREE" : escapeHtml(fmt(item.unitPrice))}</td>
              <td class="right">${item.isFreebie ? "FREE" : escapeHtml(fmt(item.lineTotal))}</td>
            </tr>
          `,
        )
        .join("")
    : `
      <tr>
        <td colspan="5" class="empty">No items available for this order.</td>
      </tr>
    `;

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${escapeHtml(order?.orderId || "Order Invoice")}</title>
      <style>
        :root {
          color-scheme: light;
          --ink: #101828;
          --muted: #667085;
          --line: #d0d5dd;
          --soft: #f8fafc;
          --accent: #2f6fed;
          --success: #027a48;
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          padding: 32px;
          font-family: Arial, Helvetica, sans-serif;
          color: var(--ink);
          background: #ffffff;
        }
        .sheet {
          max-width: 860px;
          margin: 0 auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          padding-bottom: 20px;
          border-bottom: 2px solid var(--ink);
        }
        .brand h1 {
          margin: 0;
          font-size: 28px;
          line-height: 1.1;
        }
        .brand p {
          margin: 8px 0 0;
          color: var(--muted);
          font-size: 13px;
        }
        .invoice-meta {
          text-align: right;
        }
        .invoice-meta h2 {
          margin: 0 0 10px;
          font-size: 24px;
          letter-spacing: 0.04em;
        }
        .invoice-meta p {
          margin: 4px 0;
          font-size: 13px;
          color: var(--muted);
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-top: 24px;
        }
        .card {
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 16px;
          background: var(--soft);
        }
        .label {
          margin: 0 0 8px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--muted);
        }
        .value {
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          white-space: pre-line;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 24px;
        }
        th, td {
          padding: 12px 10px;
          border-bottom: 1px solid var(--line);
          font-size: 13px;
          text-align: left;
          vertical-align: top;
        }
        th {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--muted);
        }
        .right {
          text-align: right;
        }
        .empty {
          text-align: center;
          color: var(--muted);
          padding: 20px 10px;
        }
        .badge {
          display: inline-block;
          margin-left: 8px;
          padding: 2px 8px;
          border-radius: 999px;
          background: #ecfdf3;
          color: var(--success);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .totals {
          width: 320px;
          margin-left: auto;
          margin-top: 24px;
          border: 1px solid var(--line);
          border-radius: 14px;
          overflow: hidden;
        }
        .totals-row {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding: 12px 16px;
          font-size: 13px;
          border-bottom: 1px solid var(--line);
        }
        .totals-row:last-child {
          border-bottom: 0;
        }
        .totals-row.total {
          background: var(--soft);
          font-size: 16px;
          font-weight: 800;
        }
        .footer {
          margin-top: 32px;
          padding-top: 16px;
          border-top: 1px solid var(--line);
          color: var(--muted);
          font-size: 12px;
        }
        @media print {
          body { padding: 0; }
          .sheet { max-width: none; }
        }
        @media (max-width: 640px) {
          body { padding: 16px; }
          .header { display: block; }
          .invoice-meta { text-align: left; margin-top: 20px; }
          .grid { grid-template-columns: 1fr; }
          .totals { width: 100%; }
        }
      </style>
    </head>
    <body>
      <div class="sheet">
        <div class="header">
          <div class="brand">
            <h1>${escapeHtml(shopTitle)}</h1>
            <p>Order invoice</p>
          </div>
          <div class="invoice-meta">
            <h2>Invoice</h2>
            <p><strong>Order ID:</strong> ${escapeHtml(order?.orderId || "-")}</p>
            <p><strong>Date:</strong> ${escapeHtml(orderDate)}</p>
            <p><strong>Status:</strong> ${escapeHtml(statusLabel)}</p>
            <p><strong>Payment:</strong> ${escapeHtml(paymentMethod)} · ${escapeHtml(paymentState)}</p>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <p class="label">Customer</p>
            <p class="value">${escapeHtml(customerName)}\n${escapeHtml(customerPhone)}</p>
          </div>
          <div class="card">
            <p class="label">Shipping address</p>
            <p class="value">${escapeHtml(addressStr || "No address provided")}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th class="right">Qty</th>
              <th class="right">Unit price</th>
              <th class="right">Line total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Subtotal</span>
            <strong>${escapeHtml(fmt(subtotal))}</strong>
          </div>
          <div class="totals-row">
            <span>Tax & charges</span>
            <strong>${escapeHtml(fmt(taxValue))}</strong>
          </div>
          <div class="totals-row total">
            <span>Total</span>
            <span>${escapeHtml(fmt(grandTotal))}</span>
          </div>
        </div>

        <div class="footer">
          Generated from dashboard order details on ${escapeHtml(formatPrintableDateTime(new Date().toISOString()))}.
        </div>
      </div>
    </body>
  </html>`;
};

const stepIcon: Record<string, any> = {
  created: FiClock,
  processing: FiPackage,
  shipped: FiTruck,
  delivered: FiCheck,
};

function SectionLabel({
  children,
  right,
  muted,
}: {
  children: string;
  right?: React.ReactNode;
  muted: string;
}) {
  return (
    <Flex align="center" justify="space-between" mb={3}>
      <Text fontSize="10px" fontWeight="700" letterSpacing="0.1em" textTransform="uppercase" color={muted}>
        {children}
      </Text>
      {right}
    </Flex>
  );
}

export default function OrderDrawer({ isOpen, onClose, order }: Props) {
  const { orderStore, auth } = stores;
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const toast = useToast();

  const placement = useBreakpointValue<any>({ base: "bottom", md: "right" });

  const bg        = useColorModeValue("white", "#0F1117");
  const sectionBg = useColorModeValue("#F7F8FA", "#181B24");
  const border    = useColorModeValue("#E8EAF0", "#252836");
  const text      = useColorModeValue("#0D1117", "#F0F2F8");
  const muted     = useColorModeValue("#6B7280", "#9CA3AF");
  const sub       = useColorModeValue("#9CA3AF", "#6B7280");
  const inputBg   = useColorModeValue("#F3F4F6", "#1E2130");
  const accent    = "#3B6FFF";
  const accentBg  = useColorModeValue("#EEF2FF", "rgba(59,111,255,0.14)");
  const accentTxt = useColorModeValue("#3B6FFF", "#7BA3FF");
  const greenBg   = useColorModeValue("#ECFDF3", "rgba(52,211,153,0.1)");
  const greenTxt  = useColorModeValue("#027A48", "#34D399");
  const warnBg    = useColorModeValue("#FFFBEB", "rgba(251,191,36,0.1)");
  const warnTxt   = useColorModeValue("#92400E", "#FBBF24");

  if (!order) return null;

  const rawStatus     = String(order.orderStatus ?? "");
  const curStatus     = normalizeOrderStatusKey(rawStatus);
  const currentStatusValue = selectableStatuses.includes(curStatus) ? curStatus : "created";
  const meta          = getOrderStatusMeta(rawStatus);
  const stepIdx       = flow.indexOf(curStatus);
  const cancelled     = curStatus === "cancelled";
  const totalValue    = Number(order.quote?.price?.value || order.total || 0);
  const breakup: any[] = order.quote?.breakup ?? [];
  const taxValue      = Number(breakup.find((b: any) => b.title_type === "tax")?.price?.value ?? 0);
  const hasFreebies   = breakup.some((b: any) => b.title_type === "item" && Number(b.price?.value) === 0);
  const isOnline      = order.paymentMethod?.toLowerCase() === "online";
  const isPaid        = order.paymentStatus === "paid";

  const addressStr = [
    order.shippingAddress?.addressLine1,
    order.shippingAddress?.addressLine2,
    order.shippingAddress?.city,
    order.shippingAddress?.state,
    order.shippingAddress?.postalCode,
  ].filter(Boolean).join(", ");

  const companyName =
    (typeof order.company === "object" &&
      (order.company?.name || order.company?.companyName || order.company?.shopName)) ||
    (typeof auth.company === "object" && (auth.company?.name || auth.company?.companyName || auth.company?.shopName)) ||
    (typeof auth.user?.company === "object" &&
      (auth.user?.company?.name || auth.user?.company?.companyName || auth.user?.company?.shopName)) ||
    "";

  const initials = (order.user?.name || "UK")
    .split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();

  const doStatusChange = async (s: string) => {
    setIsUpdating(true);
    try {
      const d = await orderStore.updateOrderStatus(order._id, s);
      if (d.success) toast({ title: "Status updated", status: "success", duration: 2000 });
      else toast({ title: "Failed", description: d.message, status: "error" });
    } catch (e: any) {
      toast({ title: "Error", description: e?.message, status: "error" });
    } finally { setIsUpdating(false); }
  };

  const doItemStatus = async (fid: string, s: string) => {
    if (!fid) return;
    setIsUpdating(true);
    try {
      const d = await orderStore.updateOrderItemStatus(order._id, fid, s);
      if (d.success) toast({ title: "Item updated", status: "success", duration: 2000 });
      else toast({ title: "Failed", description: d.message, status: "error" });
    } catch (e: any) {
      toast({ title: "Error", description: e?.message, status: "error" });
    } finally { setIsUpdating(false); }
  };

  const handlePrintInvoice = async () => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      toast({
        title: "Printing is not available",
        description: "This environment does not support invoice printing.",
        status: "error",
      });
      return;
    }

    setIsPrinting(true);

    let iframe: HTMLIFrameElement | null = null;

    const cleanup = () => {
      if (iframe?.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
      setIsPrinting(false);
    };

    try {
      const invoiceHtml = buildOrderInvoiceHtml({
        order,
        companyName,
        addressStr,
        totalValue,
        taxValue,
        isOnline,
        isPaid,
      });

      iframe = document.createElement("iframe");
      iframe.setAttribute("aria-hidden", "true");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      iframe.style.opacity = "0";
      iframe.style.pointerEvents = "none";

      document.body.appendChild(iframe);
      const printWindow = iframe.contentWindow;
      const printDocument = printWindow?.document;

      if (!printWindow || !printDocument || typeof printWindow.print !== "function") {
        cleanup();
        toast({
          title: "Printing failed",
          description: "This browser could not open the print dialog.",
          status: "error",
        });
        return;
      }

      printDocument.open();
      printDocument.write(invoiceHtml);
      printDocument.close();

      window.setTimeout(() => {
        try {
          printWindow.focus();
          printWindow.print();
          printWindow.onafterprint = () => {
            window.setTimeout(cleanup, 200);
          };
          window.setTimeout(() => {
            if (iframe?.parentNode) {
              cleanup();
            }
          }, 1500);
        } catch (printError: any) {
          cleanup();
          toast({
            title: "Printing failed",
            description: printError?.message || "The invoice preview could not be printed.",
            status: "error",
          });
        }
      }, 300);
    } catch (error: any) {
      cleanup();
      toast({
        title: "Printing failed",
        description: error?.message || "Could not prepare the invoice.",
        status: "error",
      });
    }
  };

  return (
    <Drawer isOpen={isOpen} placement={placement} onClose={onClose} isFullHeight={false}>
      <DrawerOverlay backdropFilter="blur(3px)" bg="blackAlpha.500" />
      <DrawerContent
        maxH={{ base: "94vh", md: "100vh" }}
        w={{ md: "50vw" }}
        px={{md:4}}
        maxW={{ md: "50vw" }}
        borderTopRadius={{ base: "22px", md: "0" }}
        bg={bg}
        boxShadow={{ base: "0 -8px 40px rgba(0,0,0,0.18)", md: "-8px 0 40px rgba(0,0,0,0.12)" }}
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        {/* Handle */}
        <Flex justify="center" pt={2.5} display={{ base: "flex", md: "none" }}>
          <Box h="4px" w="32px" borderRadius="full" bg={border} />
        </Flex>

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <Box px={4} pt={{ base: 3, md: 5 }} pb={3.5} borderBottom="1px solid" borderColor={border}>
          <Flex align="start" justify="space-between" gap={3}>
            <Box flex={1} minW={0}>
              <Flex align="center" gap={2} flexWrap="wrap">
                <Text fontSize="10.5px" fontWeight="600" color={sub} letterSpacing="0.02em">
                  {order.orderId}
                </Text>
                <Badge px={2} py={0.5} borderRadius="md" fontSize="10px" fontWeight="700"
                  colorScheme={meta.colorScheme} textTransform="capitalize">
                  {meta.label}
                </Badge>
              </Flex>
              <Text mt={1} fontSize="18px" fontWeight="800" color={text} letterSpacing="-0.03em">
                Order Details
              </Text>
              <Text fontSize="11.5px" color={muted} mt={0.5}>
                {order.createdAt ? format(new Date(order.createdAt), "d MMM yyyy · h:mm a") : "—"}
              </Text>
            </Box>
            <Flex as="button" onClick={onClose} h={8} w={8} align="center" justify="center"
              borderRadius="full" bg={inputBg} color={muted} flexShrink={0}
              transition="background 0.15s" _hover={{ bg: sectionBg }}>
              <Icon as={FiX} boxSize={4} />
            </Flex>
          </Flex>

          <Flex mt={2.5} gap={1.5} flexWrap="wrap">
            {[
              { icon: FiPackage, label: `${order.items?.length ?? 0} items`, warn: false },
              { icon: isOnline ? FiCreditCard : FiDollarSign, label: isOnline ? "Online" : "Cash on delivery", warn: false },
              { icon: isPaid ? FiCheck : FiClock, label: isPaid ? "Payment received" : "Payment pending", warn: !isPaid },
            ].map((c, i) => (
              <Flex key={i} align="center" gap={1.5}
                bg={c.warn ? warnBg : accentBg}
                color={c.warn ? warnTxt : accentTxt}
                borderRadius="full" px={2.5} py={1} fontSize="10.5px" fontWeight="600">
                <Icon as={c.icon} boxSize={3} />
                {c.label}
              </Flex>
            ))}
          </Flex>
        </Box>

        <Box flex={1} overflowY="auto" css={{ "&::-webkit-scrollbar": { display: "none" } }}>
          <Box px={4} py={4}>
            <SectionLabel muted={muted}>Fulfillment</SectionLabel>
            {cancelled ? (
              <Flex align="center" gap={3} bg="red.50" borderRadius="xl" px={3.5} py={3} color="red.600">
                <Icon as={FiX} boxSize={4} flexShrink={0} />
                <Text fontSize="sm" fontWeight="700">Order Cancelled</Text>
              </Flex>
            ) : (
              <Box overflowX="auto" css={{ "&::-webkit-scrollbar": { display: "none" } }}>
                <Flex align="flex-start" gap={0} minW="max-content">
                  {flow.map((s, i) => {
                    const done = i <= stepIdx;
                    const active = i === stepIdx;
                    const Ic = stepIcon[s] ?? FiClock;
                    return (
                      <Flex key={s} align="center">
                        <Flex direction="column" align="center" gap={1.5} w="52px">
                          <Flex h={8} w={8} align="center" justify="center" borderRadius="full"
                            bg={done ? accent : inputBg}
                            color={done ? "white" : sub}
                            boxShadow={active ? `0 0 0 3px ${accent}28` : "none"}
                            transition="all 0.2s">
                            <Icon as={Ic} boxSize={3.5} strokeWidth={2.5} />
                          </Flex>
                          <Text fontSize="9px" fontWeight={active ? "700" : "500"}
                            color={done ? accent : sub} textAlign="center" textTransform="capitalize">
                            {getOrderStatusMeta(s).label}
                          </Text>
                        </Flex>
                        {i < flow.length - 1 && (
                          <Box h="1.5px" w="12px" mb="14px" borderRadius="full"
                            bg={done && i < stepIdx ? accent : border} flexShrink={0} transition="background 0.2s" />
                        )}
                      </Flex>
                    );
                  })}
                </Flex>
              </Box>
            )}

            <Flex align="center" gap={2.5} mt={4}>
              <Text fontSize="12px" fontWeight="600" color={muted} flexShrink={0}>Update to</Text>
              <Select value={currentStatusValue} onChange={(e) => doStatusChange(e.target.value)}
                isDisabled={isUpdating} bg={inputBg} border="1px solid" borderColor={border}
                borderRadius="xl" h="38px" fontSize="13px" fontWeight="600" color={text} flex={1}
                _focus={{ boxShadow: `0 0 0 3px ${accent}25`, borderColor: accent }}>
                <option value="created">Placed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </Flex>
          </Box>

          <Box h="8px" bg={sectionBg} />

          {/* Customer */}
          <Box px={4} py={4}>
            <SectionLabel muted={muted}>Customer</SectionLabel>
            <Flex align="center" gap={3}>
              <Flex h={10} w={10} align="center" justify="center" borderRadius="xl"
                bg={accent} color="white" fontSize="13px" fontWeight="800" flexShrink={0}>
                {initials}
              </Flex>
              <Box flex={1} minW={0}>
                <Text fontSize="14px" fontWeight="700" color={text} isTruncated>
                  {order.user?.name ?? "Unknown"}
                </Text>
                <Flex align="center" gap={1.5} mt={0.5}>
                  <Icon as={FiPhone} boxSize={3} color={sub} />
                  <Text fontSize="12px" color={muted}>{order.user?.phone ?? "—"}</Text>
                </Flex>
              </Box>
            </Flex>
            {addressStr && (
              <Flex align="start" gap={2} mt={3}>
                <Icon as={FiMapPin} boxSize={3.5} color={sub} mt="2px" flexShrink={0} />
                <Text fontSize="12.5px" color={muted} lineHeight="1.6">{addressStr}</Text>
              </Flex>
            )}
          </Box>

          <Box h="8px" bg={sectionBg} />

          {/* Items */}
          <Box px={4} py={4}>
            <SectionLabel
              muted={muted}
              right={
                <Flex align="center" justify="center" h={5} minW={5} px={1.5} borderRadius="full" bg={accentBg}>
                  <Text fontSize="10px" fontWeight="700" color={accentTxt}>{order.items?.length ?? 0}</Text>
                </Flex>
              }
            >
              Items
            </SectionLabel>

            <Flex direction="column">
              {order.items?.map((it: any, i: number) => {
                const fulfillment = order.fulfillments?.find((f: any) => f.id === it.fulfillment_id);
                const itemStatus  = normalizeFulfillmentStatus(fulfillment?.status);
                const isFreebie   = it.unitPrice === 0 || it.productName?.startsWith("[FREE]");
                const name        = it.productName
                  ?.replace(/^\[FREE\]\s*/i, "")
                  ?.replace(/\s*\(Freebie\)\s*$/i, "")
                  ?.trim();
                const lineTotal   = isFreebie ? 0 : it.quantity * it.unitPrice;

                return (
                  <Box key={i}>
                    {i > 0 && <Box borderTop="1px solid" borderColor={border} my={3} />}
                    <Flex gap={3} align="start">
                      {/* Thumbnail */}
                      <Box h="52px" w="52px" borderRadius="12px" overflow="hidden"
                        flexShrink={0} border="1px solid" borderColor={border} bg={inputBg}>
                        {it.productImage
                          ? <Image src={it.productImage} alt="" h="100%" w="100%" objectFit="cover" />
                          : <Flex h="full" align="center" justify="center"><Icon as={FiPackage} boxSize={5} color={sub} /></Flex>}
                      </Box>

                      <Box flex={1} minW={0}>
                        {/* Name + total */}
                        <Flex align="start" justify="space-between" gap={2}>
                          <Text fontSize="13px" fontWeight="700" color={text}
                            noOfLines={1} flex={1} title={name} lineHeight="1.4">
                            {name}
                          </Text>
                          <Text fontSize="13px" fontWeight="800" flexShrink={0} letterSpacing="-0.02em"
                            color={isFreebie ? greenTxt : text}>
                            {isFreebie ? "FREE" : fmt(lineTotal)}
                          </Text>
                        </Flex>

                        {/* Qty + freebie badge */}
                        <Flex align="center" gap={1.5} mt={0.5} flexWrap="wrap">
                          <Text fontSize="11.5px" color={muted}>
                            Qty {it.quantity}{it.unitPrice > 0 ? ` · ${fmt(it.unitPrice)}` : ""}
                          </Text>
                          {isFreebie && (
                            <Flex align="center" gap={1} bg={greenBg} color={greenTxt}
                              borderRadius="full" px={1.5} py={0.5} fontSize="9px" fontWeight="700"
                              textTransform="uppercase" letterSpacing="0.05em">
                              <Icon as={FiGift} boxSize={2.5} />
                              Freebie
                            </Flex>
                          )}
                        </Flex>

                        {/* Status inline */}
                        <Flex align="center" gap={2} mt={1.5}>
                          <Text fontSize="11px" color={sub} fontWeight="500" flexShrink={0}>Status</Text>
                          <Select size="xs" value={itemStatus}
                            onChange={(e) => doItemStatus(it.fulfillment_id, e.target.value)}
                            isDisabled={isUpdating || !it.fulfillment_id}
                            bg={inputBg} border="1px solid" borderColor={border}
                            borderRadius="lg" h="26px" fontSize="11px" fontWeight="600"
                            color={text} flex={1} maxW="140px"
                            _focus={{ boxShadow: `0 0 0 2px ${accent}25` }}>
                            {ORDER_ITEM_STATUS_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Select>
                        </Flex>
                      </Box>
                    </Flex>
                  </Box>
                );
              })}
            </Flex>
          </Box>

          <Box h="8px" bg={sectionBg} />

          {/* Payment */}
          <Box px={4} py={4}>
            <SectionLabel
              muted={muted}
              right={
                <Flex align="center" gap={1.5} bg={inputBg} borderRadius="full"
                  px={2} py={0.5} fontSize="10.5px" fontWeight="600" color={muted}>
                  <Icon as={isOnline ? FiCreditCard : FiDollarSign} boxSize={3} />
                  {isOnline ? "Online" : "COD"}
                </Flex>
              }
            >
              Payment Summary
            </SectionLabel>

            <Flex direction="column" gap={0}>
              {breakup
                .filter((b: any) => b.title_type === "item" && Number(b.price?.value) > 0)
                .map((b: any, i: number) => (
                  <Flex key={i} justify="space-between" align="start" gap={3}
                    py={2.5} borderBottom="1px solid" borderColor={border}>
                    <Text fontSize="12.5px" color={muted} flex={1} noOfLines={1} title={b.title}>
                      {b.title}
                    </Text>
                    <Text fontSize="12.5px" fontWeight="700" color={text} flexShrink={0}>
                      {fmt(b.price?.value)}
                    </Text>
                  </Flex>
                ))}

              {hasFreebies && (
                <Flex justify="space-between" align="center" py={2.5} borderBottom="1px solid" borderColor={border}>
                  <Flex align="center" gap={1.5}>
                    <Icon as={FiGift} boxSize={3.5} color={greenTxt} />
                    <Text fontSize="12.5px" color={greenTxt} fontWeight="600">Freebie included</Text>
                  </Flex>
                  <Text fontSize="12.5px" fontWeight="700" color={greenTxt}>FREE</Text>
                </Flex>
              )}

              {taxValue > 0 && (
                <Flex justify="space-between" align="center" py={2.5} borderBottom="1px solid" borderColor={border}>
                  <Text fontSize="12.5px" color={muted}>Tax &amp; charges</Text>
                  <Text fontSize="12.5px" fontWeight="700" color={text}>{fmt(taxValue)}</Text>
                </Flex>
              )}

              <Flex justify="space-between" align="center" pt={3}>
                <Text fontSize="14px" fontWeight="700" color={text}>Total</Text>
                <Text fontSize="22px" fontWeight="900" color={text} letterSpacing="-0.04em">
                  {fmt(totalValue)}
                </Text>
              </Flex>

              <Flex mt={3} align="center" justify="space-between"
                bg={isPaid ? greenBg : warnBg} borderRadius="xl" px={3} py={2.5}>
                <Text fontSize="12.5px" fontWeight="700" color={isPaid ? greenTxt : warnTxt}>
                  {isPaid ? "✓ Payment received" : "⏳ Payment pending"}
                </Text>
                <Text fontSize="10px" fontWeight="700" color={isPaid ? greenTxt : warnTxt}
                  textTransform="uppercase" letterSpacing="0.08em">
                  {order.paymentStatus}
                </Text>
              </Flex>
            </Flex>
          </Box>

          {/* Activity */}
          {order.statusHistory?.length > 0 && (
            <>
              <Box h="8px" bg={sectionBg} />
              <Box px={4} py={4}>
                <SectionLabel
                  muted={muted}
                  right={
                    <Box as="button" onClick={() => setShowHistory(v => !v)}
                      fontSize="11px" fontWeight="600" color={accentTxt}>
                      {showHistory ? "Collapse" : "Show all"}
                    </Box>
                  }
                >
                  Activity
                </SectionLabel>

                <Flex direction="column">
                  {([...order.statusHistory].reverse().slice(0, showHistory ? undefined : 3) as any[])
                    .map((h: any, i: number, arr: any[]) => {
                      const historyEntry = parseHistoryStatus(order, h.status);
                      const historyStatusMeta = historyEntry.isItemStatus
                        ? getOrderStatusMeta(historyEntry.status)
                        : null;

                      return (
                        <Flex key={i} gap={3}>
                        <Flex direction="column" align="center" flexShrink={0} w="22px">
                          <Flex h={6} w={6} align="center" justify="center" borderRadius="full"
                            bg={i === 0 ? accent : inputBg} color={i === 0 ? "white" : sub} flexShrink={0}>
                            <Icon as={FiArrowRight} boxSize={2.5} />
                          </Flex>
                          {i < arr.length - 1 && (
                            <Box w="1px" flex={1} minH="14px" bg={border} my={1} />
                          )}
                        </Flex>
                        <Box pb={i < arr.length - 1 ? 3 : 0} pt={0.5} flex={1} minW={0}>
                          {historyEntry.isItemStatus ? (
                            <Flex align="center" gap={2} minW={0} wrap="wrap">
                              <Text fontSize="12.5px" fontWeight="600" color={text} lineHeight="1.4" noOfLines={1}>
                                {historyEntry.title}
                              </Text>
                              {historyStatusMeta ? (
                                <Badge
                                  colorScheme={historyStatusMeta.colorScheme}
                                  borderRadius="full"
                                  px={2}
                                  py={0.5}
                                  fontSize="10px"
                                  fontWeight="700"
                                  textTransform="capitalize"
                                >
                                  {historyStatusMeta.label}
                                </Badge>
                              ) : null}
                            </Flex>
                          ) : (
                            <Text fontSize="12.5px" fontWeight="600" color={text} lineHeight="1.4" isTruncated>
                              {historyEntry.title}
                            </Text>
                          )}
                          <Text fontSize="11px" color={sub} mt={0.5}>
                            {h.timestamp ? format(new Date(h.timestamp), "d MMM yyyy · h:mm a") : "—"}
                          </Text>
                        </Box>
                        </Flex>
                      );
                    })}
                </Flex>
              </Box>
            </>
          )}

          <Box h="4px" />
        </Box>

        <Box borderTop="1px solid" borderColor={border} bg={bg} px={4} pt={3}
          pb={{ base: "calc(env(safe-area-inset-bottom, 0px) + 12px)", md: 4 }}>
          <Flex gap={2.5}>
            <Button h="44px" variant="outline" borderRadius="xl" fontSize="13px" fontWeight="700"
              borderColor={border} color={text} bg="transparent" _hover={{ bg: inputBg }}
              onClick={onClose} px={5} flexShrink={0}>
              Close
            </Button>
            <Button flex={1} h="44px" borderRadius="xl" fontSize="13px" fontWeight="700"
              bg={accent} color="white" _hover={{ bg: "#2B5EF0" }} _active={{ bg: "#2040CC" }}
              leftIcon={<Icon as={FiPrinter} boxSize={4} />} transition="background 0.15s"
              onClick={() => void handlePrintInvoice()}
              isLoading={isPrinting}>
              Print Invoice
            </Button>
          </Flex>
        </Box>
      </DrawerContent>
    </Drawer>
  );
}
