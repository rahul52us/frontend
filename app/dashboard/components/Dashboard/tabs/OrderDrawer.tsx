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
import { getStatusMeta } from "./OrdersTab";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

const flow = ["created", "pending", "confirmed", "processing", "shipped", "delivered"];

const STATUS_ALIAS: Record<string, string> = {
  "in-progress": "processing",
  initialized: "created",
};

const normalizeStatus = (s: string) =>
  STATUS_ALIAS[String(s ?? "").toLowerCase()] ?? String(s ?? "").toLowerCase();

const fmt = (amount: any) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const stepIcon: Record<string, any> = {
  created: FiClock,
  pending: FiClock,
  confirmed: FiCheckCircle,
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
  const { orderStore } = stores;
  const [isUpdating, setIsUpdating] = useState(false);
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
  const curStatus     = normalizeStatus(rawStatus);
  const meta          = getStatusMeta(rawStatus);
  const stepIdx       = flow.indexOf(curStatus);
  const cancelled     = rawStatus.toLowerCase() === "cancelled";
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
                  {rawStatus}
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
                            {s}
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
              <Select value={curStatus} onChange={(e) => doStatusChange(e.target.value)}
                isDisabled={isUpdating} bg={inputBg} border="1px solid" borderColor={border}
                borderRadius="xl" h="38px" fontSize="13px" fontWeight="600" color={text} flex={1}
                _focus={{ boxShadow: `0 0 0 3px ${accent}25`, borderColor: accent }}>
                <option value="created">Created</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
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
                const itemStatus  = normalizeStatus(fulfillment?.status ?? "pending");
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
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
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
                    .map((h: any, i: number, arr: any[]) => (
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
                          <Text fontSize="12.5px" fontWeight="600" color={text} lineHeight="1.4" isTruncated>
                            {h.status}
                          </Text>
                          <Text fontSize="11px" color={sub} mt={0.5}>
                            {h.timestamp ? format(new Date(h.timestamp), "d MMM yyyy · h:mm a") : "—"}
                          </Text>
                        </Box>
                      </Flex>
                    ))}
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
              leftIcon={<Icon as={FiPrinter} boxSize={4} />} transition="background 0.15s">
              Print Invoice
            </Button>
          </Flex>
        </Box>
      </DrawerContent>
    </Drawer>
  );
}