"use client";

import {
    Badge,
    Box,
    Button,
    Container,
    Divider,
    Flex,
    Grid,
    GridItem,
    Heading,
    HStack,
    Icon,
    Image,
    Radio,
    RadioGroup,
    Spinner,
    Text,
    useColorModeValue,
    useDisclosure,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { themeConfig } from "../../theme/themeConfig";
import {
    FaCreditCard,
    FaHouse,
    FaLocationDot,
    FaLock,
    FaMoneyBillWave,
    FaPhone,
    FaPlus,
    FaShieldHalved
} from "react-icons/fa6";
import {
    FiAlertCircle,
    FiArrowLeft,
    FiHeadphones,
    FiPackage,
    FiRefreshCw,
    FiRotateCcw,
    FiShield,
    FiShoppingBag,
    FiTruck
} from "react-icons/fi";
import { IoReceiptOutline } from "react-icons/io5";

import AddressModal from "../../component/Cart/component/DeliveryAddressModal/DelivaryAddressModal";
import stores from "../../store/stores";

const FREE_SHIPPING_THRESHOLD = 499;
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80";

/* -------------------------------------------------------------------------- */
/*  House Illustration (Consistent with Cart Design)                         */
/* -------------------------------------------------------------------------- */
const HouseIllustration = () => (
  <Box
    position="absolute"
    right="8px"
    bottom="6px"
    pointerEvents="none"
    userSelect="none"
    opacity={{ base: 0.8, sm: 0.95 }}
  >
    <svg
      width="70"
      height="52"
      viewBox="0 0 72 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 48C14 44 38 43 72 48V54H0V48Z" fill="#FCE7E7" />
      <circle cx="11" cy="38" r="8" fill="#0D9488" opacity="0.85" />
      <rect x="10" y="42" width="2.5" height="7" rx="1" fill="#78350F" />
      <circle cx="63" cy="38" r="7" fill="#0D9488" opacity="0.8" />
      <rect x="62" y="42" width="2" height="7" rx="1" fill="#78350F" />
      <rect
        x="21"
        y="26"
        width="34"
        height="23"
        rx="2"
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth="1"
      />
      <path d="M17 27L38 12L59 27H17Z" fill="#EF4444" />
      <rect x="48" y="16" width="4.5" height="8" fill="#B91C1C" rx="1" />
      <rect x="34" y="37" width="8" height="12" rx="1" fill="var(--color-primary)" />
      <rect x="25" y="31" width="6" height="6" rx="1" fill="#38BDF8" />
      <rect x="45" y="31" width="6" height="6" rx="1" fill="#38BDF8" />
    </svg>
  </Box>
);

/* -------------------------------------------------------------------------- */
/*  Checkout Client Component                                                 */
/* -------------------------------------------------------------------------- */
const CheckoutClient = observer(() => {
  const { cartStore, auth, orderStore, shopStore } = stores;
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const cBg = useColorModeValue("#F8FAFC", "var(--color-bg)");
  const cSurface = useColorModeValue("#FFFFFF", "var(--color-surface)");
  const cSurfaceElevated = useColorModeValue("#FAFBFD", "var(--color-surface-elevated)");
  const cBorder = useColorModeValue("#E2E8F0", "var(--color-border)");
  const cBorderSubtle = useColorModeValue("#E5EAF0", "var(--color-border)");
  const cText = useColorModeValue("#172033", "var(--color-text-primary)");
  const cTextMuted = useColorModeValue("#64748B", "var(--color-text-muted)");
  const cTextSubtle = useColorModeValue("#475569", "var(--color-text-secondary)");
  const cPrimary = "var(--color-primary)";
  const cPrimaryHover = "var(--color-primary-hover)";
  const cPrimarySoft = useColorModeValue("#E6F7F3", "rgba(6, 95, 104, 0.2)");
  const cBannerBg = useColorModeValue("#FFF0F0", "rgba(239, 68, 68, 0.12)");
  const cBannerBorder = useColorModeValue("#FFD5D5", "rgba(239, 68, 68, 0.25)");
  const cActiveBg = useColorModeValue("#F0FDFB", "rgba(6, 95, 104, 0.15)");

  const buyNowId = searchParams.get("productId");
  const isBuyNow = searchParams.get("buyNow") === "true";

  const [buyNowProduct, setBuyNowProduct] = useState<any>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Initialized Order State
  const [initializedOrder, setInitializedOrder] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Load Razorpay Checkout Script
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ((window as any).Razorpay) {
        setIsScriptLoaded(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      document.body.appendChild(script);
    }
  }, []);

  // Fetch addresses if logged in
  useEffect(() => {
    if (auth.token && auth.addresses.length === 0) {
      auth.fetchAddresses();
    }
  }, [auth.token, auth]);

  const addresses = useMemo(() => auth.addresses || [], [auth.addresses]);

  // Pre-select default or first address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find((a: any) => a.isDefault);
      setSelectedAddress(
        defaultAddr
          ? defaultAddr._id || defaultAddr.id
          : addresses[0]._id || addresses[0].id
      );
    }
  }, [addresses, selectedAddress]);

  // Fetch Buy Now product if applicable
  useEffect(() => {
    let isMounted = true;
    if (isBuyNow && buyNowId) {
      shopStore.getProductById(buyNowId).then((res: any) => {
        if (isMounted && res?.data) {
          setBuyNowProduct(res.data);
        }
      }).catch((err: any) => {
        console.error("Failed to fetch buy now product", err);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [isBuyNow, buyNowId, shopStore]);

  // Initialize Order
  const initOrder = async () => {
    if (!auth.token) return;

    setIsInitializing(true);
    setInitError(null);
    try {
      let itemsPayload: any[] = [];

      if (isBuyNow && buyNowId) {
        let product = buyNowProduct;
        if (!product) {
          const res = await shopStore.getProductById(buyNowId);
          if (res?.data) {
            product = res.data;
            setBuyNowProduct(product);
          }
        }
        if (product) {
          itemsPayload.push({
            product: product._id || product.id,
            quantity: 1,
            variant: product.variant,
          });
        }
      } else {
        if (cartStore.cartItems.length === 0) {
          await cartStore.fetchCart();
        }
        if (cartStore.cartItems.length === 0) {
          setIsInitializing(false);
          return;
        }
        itemsPayload = cartStore.cartItems.map((item) => ({
          product: item.product?._id || item.product?.id,
          quantity: item.quantity || 1,
          variant: item.product?.variant,
        }));
      }

      if (itemsPayload.length > 0) {
        const address = addresses.find(
          (a: any) => (a._id || a.id) === selectedAddress
        ) || addresses[0];

        const payload: any = {
          items: itemsPayload,
        };
        if (address) {
          payload.shippingAddress = address;
        }

        const res = await orderStore.initializeOrder(payload);
        if (res?.success) {
          setInitializedOrder(res.data);
          if (res.data?.shippingAddress?._id) {
            setSelectedAddress(res.data.shippingAddress._id);
          }
        } else {
          setInitError(res?.message || "Failed to initialize order details.");
        }
      }
    } catch (error: any) {
      console.error("Order initialization error:", error);
      setInitError(error?.message || "Could not prepare order with current items.");
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if (auth.token) {
      initOrder();
    }
  }, [auth.token, isBuyNow, buyNowId, cartStore.cartItems.length]);

  // Address modal controls
  const {
    isOpen: isAddressModalOpen,
    onOpen: onAddressModalOpen,
    onClose: onAddressModalClose,
  } = useDisclosure();

  const handleAddNewAddress = async (newAddress: any) => {
    try {
      const res = await auth.addAddress(newAddress);
      await auth.fetchAddresses();
      const newId = res?.data?._id || res?.data?.id;
      if (newId) {
        handleSelectAddress(newId);
      }
      toast({
        title: "Address saved",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Failed to add address",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateAddress = async (id: string, data: any) => {
    try {
      await auth.updateAddress(id, data);
      await auth.fetchAddresses();
    } catch {
      toast({ title: "Failed to update address", status: "error" });
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await auth.deleteAddress(id);
      await auth.fetchAddresses();
      if (selectedAddress === id) {
        setSelectedAddress("");
      }
    } catch {
      toast({ title: "Failed to delete address", status: "error" });
    }
  };

  const handleSelectAddress = async (addressId: string) => {
    setSelectedAddress(addressId);
    const address = addresses.find((a: any) => (a._id || a.id) === addressId);
    if (!address || !auth.token) return;

    try {
      let currentItems: any[] = [];
      if (isBuyNow && buyNowProduct) {
        currentItems = [{
          product: buyNowProduct._id || buyNowProduct.id,
          quantity: 1,
          variant: buyNowProduct.variant,
        }];
      } else if (cartStore.cartItems.length > 0) {
        currentItems = cartStore.cartItems.map((item) => ({
          product: item.product?._id || item.product?.id,
          quantity: item.quantity,
          variant: item.product?.variant,
        }));
      } else if (initializedOrder?.orders) {
        currentItems = initializedOrder.orders.flatMap((o: any) =>
          (o.items || []).map((i: any) => ({
            product: i.product?._id || i.product?.id || i.product,
            quantity: i.quantity,
            variant: i.variant,
          }))
        );
      }

      if (currentItems.length > 0) {
        const payload = {
          items: currentItems,
          shippingAddress: address,
        };
        const res = await orderStore.initializeOrder(payload);
        if (res?.success) {
          setInitializedOrder(res.data);
          toast({
            title: "Delivery address updated",
            status: "success",
            duration: 2000,
          });
        }
      }
    } catch (error) {
      console.error("Failed to update order address", error);
    }
  };

  // Place Order Handler
  const handlePlaceOrder = async () => {
    if (!auth.token) {
      toast({
        title: "Please sign in to place your order",
        status: "info",
        position: "top",
      });
      router.push("/login?redirect=/checkout");
      return;
    }

    if (!selectedAddress) {
      toast({
        title: "Delivery address required",
        description: "Please select or add a delivery address to proceed.",
        status: "warning",
        position: "top",
      });
      onAddressModalOpen();
      return;
    }

    setIsProcessing(true);
    try {
      const address = addresses.find(
        (a: any) => (a._id || a.id) === selectedAddress
      );

      if (paymentMethod === "cod") {
        const payload = {
          shippingAddress: address,
          paymentMethod: "cod",
        };

        await stores.orderStore.confirmOrder(payload);

        toast({
          title: "Order Placed Successfully! 🎉",
          description: "Thank you for your order. We are preparing it for delivery.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        if (!isBuyNow) {
          cartStore.clearCart();
        }
        router.push("/account?tab=orders");

      } else if (paymentMethod === "online") {
        if (!isScriptLoaded || typeof window === "undefined" || !(window as any).Razorpay) {
          toast({
            title: "Payment SDK not ready",
            description: "Please check your connection and try again.",
            status: "warning",
          });
          return;
        }

        let orderIds: string[] = [];
        if (initializedOrder?.orders && Array.isArray(initializedOrder.orders)) {
          orderIds = initializedOrder.orders.map((o: any) => o._id || o.id).filter(Boolean);
        } else if (Array.isArray(initializedOrder)) {
          orderIds = initializedOrder.map((o: any) => o._id || o.id).filter(Boolean);
        } else if (initializedOrder?._id || initializedOrder?.id) {
          orderIds = [initializedOrder._id || initializedOrder.id];
        }

        if (orderIds.length === 0) {
          throw new Error("Unable to identify order references for payment.");
        }

        const paymentOrder = await stores.orderStore.createPaymentOrder({ orderIds });

        if (!paymentOrder || !paymentOrder.success) {
          throw new Error(paymentOrder?.message || "Failed to initiate payment");
        }

        const { data: rzpOrder } = paymentOrder;

        const options = {
          key:
            process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
            "rzp_test_0XDl7Od4MRUktB",
          amount: rzpOrder.amount,
          currency: rzpOrder.currency || "INR",
          name: "Business Sahayata",
          description: "Order Payment",
          order_id: rzpOrder.id,
          handler: async (response: any) => {
            try {
              const verifyRes = await stores.orderStore.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyRes.success) {
                toast({
                  title: "Payment Successful! 🎉",
                  description: "Your order has been placed successfully.",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
                if (!isBuyNow) {
                  cartStore.clearCart();
                }
                router.push("/account?tab=orders");
              } else {
                toast({
                  title: "Payment Verification Failed",
                  description: verifyRes.message || "Please contact support.",
                  status: "error",
                });
              }
            } catch (err: any) {
              toast({
                title: "Payment Verification Failed",
                description: err.message || "An unexpected error occurred.",
                status: "error",
              });
            }
          },
          prefill: {
            name: auth.user?.name || auth.user?.username || "",
            email: auth.user?.email || "",
            contact: auth.user?.phone || "",
          },
          theme: {
            color: themeConfig.colors.primary,
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          toast({
            title: "Payment Failed",
            description: response.error?.description || "Transaction was declined.",
            status: "error",
          });
        });
        rzp.open();
      }
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.message || "Could not complete your order. Please try again.",
        status: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*  Robust Normalized Display Items Calculation                              */
  /* -------------------------------------------------------------------------- */
  const displayItems = useMemo(() => {
    // 1. Buy Now Mode
    if (isBuyNow && buyNowProduct) {
      const price = Number(
        buyNowProduct.discountPrice ?? buyNowProduct.price ?? 0
      );
      const img =
        buyNowProduct.images?.[0]?.url ||
        buyNowProduct.images?.[0] ||
        buyNowProduct.image ||
        FALLBACK_IMAGE;

      return [
        {
          id: buyNowProduct._id || buyNowProduct.id || "buy-now",
          name:
            buyNowProduct.title ||
            buyNowProduct.name ||
            buyNowProduct.productName ||
            "Selected Product",
          image: typeof img === "string" ? img : img?.url || FALLBACK_IMAGE,
          quantity: 1,
          unitPrice: price,
          total: price,
          variant: buyNowProduct.variant,
        },
      ];
    }

    // 2. From Initialized Order if populated
    const rawItems = initializedOrder?.orders
      ? initializedOrder.orders.flatMap((o: any) => o.items || [])
      : initializedOrder?.items || [];

    if (rawItems.length > 0) {
      return rawItems.map((item: any, idx: number) => {
        const rawId =
          item.product?._id ||
          item.product?.id ||
          item.product ||
          item._id ||
          `item-${idx}`;

        const matchedCart = cartStore.cartItems.find(
          (c) => (c.product?._id || c.product?.id) === rawId
        );

        const name =
          item.productName ||
          item.product?.title ||
          item.product?.name ||
          item.title ||
          item.name ||
          matchedCart?.product?.title ||
          matchedCart?.product?.name ||
          "Cart Item";

        const rawImg =
          item.image ||
          item.images?.[0]?.url ||
          item.images?.[0] ||
          item.product?.images?.[0]?.url ||
          item.product?.images?.[0] ||
          item.product?.image ||
          matchedCart?.product?.images?.[0]?.url ||
          matchedCart?.product?.images?.[0] ||
          matchedCart?.product?.image ||
          FALLBACK_IMAGE;

        const quantity = item.quantity || matchedCart?.quantity || 1;
        const unitPrice = Number(
          item.unitPrice ||
          item.price ||
          item.product?.discountPrice ||
          item.product?.price ||
          matchedCart?.product?.discountPrice ||
          matchedCart?.product?.price ||
          0
        );
        const lineTotal = Number(
          item.total ||
          item.itemTotal ||
          unitPrice * quantity ||
          0
        );

        return {
          id: rawId,
          name,
          image: typeof rawImg === "string" ? rawImg : rawImg?.url || FALLBACK_IMAGE,
          quantity,
          unitPrice,
          total: lineTotal,
          variant: item.variant || matchedCart?.product?.variant,
        };
      });
    }

    // 3. Fallback to cartStore items
    return cartStore.cartItems.map((c, idx) => {
      const p = c.product || {};
      const unitPrice = Number(p.discountPrice ?? p.price ?? 0);
      const rawImg =
        p.images?.[0]?.url ||
        p.images?.[0] ||
        p.image ||
        FALLBACK_IMAGE;

      return {
        id: p._id || p.id || `cart-${idx}`,
        name: p.title || p.name || "Product Item",
        image: typeof rawImg === "string" ? rawImg : rawImg?.url || FALLBACK_IMAGE,
        quantity: c.quantity || 1,
        unitPrice,
        total: unitPrice * (c.quantity || 1),
        variant: p.variant,
      };
    });
  }, [isBuyNow, buyNowProduct, initializedOrder, cartStore.cartItems]);

  /* -------------------------------------------------------------------------- */
  /*  Robust Pricing Breakdown Calculation                                      */
  /* -------------------------------------------------------------------------- */
  const pricing = useMemo(() => {
    const quote = initializedOrder?.quote;

    // Subtotal
    const quoteSubtotal = quote?.breakup
      ?.filter((b: any) => b.title_type === "item")
      ?.reduce((sum: number, b: any) => sum + parseFloat(b.price?.value || 0), 0);

    const calculatedSubtotal = displayItems.reduce(
      (sum, item) => sum + (item.total || item.unitPrice * item.quantity),
      0
    );

    const subtotal =
      quoteSubtotal && quoteSubtotal > 0 ? quoteSubtotal : calculatedSubtotal;

    // Tax
    const quoteTax = quote?.breakup
      ?.filter((b: any) => b.title_type === "tax")
      ?.reduce((sum: number, b: any) => sum + parseFloat(b.price?.value || 0), 0);
    const tax = quoteTax || 0;

    // Delivery Fee
    const quoteDelivery = quote?.breakup?.find(
      (b: any) => b.title_type === "delivery"
    )?.price?.value;

    const isFreeDelivery = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
    const deliveryFee =
      quoteDelivery !== undefined
        ? parseFloat(quoteDelivery)
        : isFreeDelivery
        ? 0
        : 40;

    // Total
    const quoteTotal = parseFloat(quote?.price?.value || "0");
    const total =
      quoteTotal && quoteTotal > 0
        ? quoteTotal
        : subtotal + tax + deliveryFee;

    return {
      subtotal,
      tax,
      deliveryFee,
      isFreeDelivery: deliveryFee === 0,
      total,
    };
  }, [initializedOrder, displayItems]);

  const currentAddress =
    addresses.find((a: any) => (a._id || a.id) === selectedAddress) ||
    addresses[0];

  /* -------------------------------------------------------------------------- */
  /*  STATE 1: Not Logged In                                                    */
  /* -------------------------------------------------------------------------- */
  if (!auth.token) {
    return (
      <Box bg={cBg} minH="80vh" py={{ base: 8, md: 16 }} px={4}>
        <Container maxW="md">
          <Box
            bg={cSurface}
            borderRadius="24px"
            p={{ base: 6, sm: 8 }}
            textAlign="center"
            border="1px solid"
            borderColor={cBorder}
            boxShadow="0 4px 20px -2px rgba(15, 23, 42, 0.05)"
          >
            <Flex
              w="64px"
              h="64px"
              borderRadius="full"
              bg={cPrimarySoft}
              color={cPrimary}
              align="center"
              justify="center"
              mx="auto"
              mb={4}
            >
              <Icon as={FaLock} boxSize={6} />
            </Flex>
            <Heading fontSize="xl" fontWeight="800" color={cText} mb={2}>
              Sign In to Complete Checkout
            </Heading>
            <Text fontSize="sm" color={cTextMuted} mb={6} lineHeight="tall">
              Please sign in or create an account to save your delivery address,
              track orders, and complete your purchase securely.
            </Text>
            <VStack spacing={3}>
              <Button
                as={NextLink}
                href="/login?redirect=/checkout"
                w="full"
                h="46px"
                bg={cPrimary}
                color="#FFFFFF"
                fontWeight="700"
                borderRadius="14px"
                _hover={{ bg: cPrimaryHover }}
              >
                Sign In / Register
              </Button>
              <Button
                as={NextLink}
                href="/products"
                w="full"
                h="46px"
                variant="outline"
                borderColor={cBorder}
                color={cTextMuted}
                fontWeight="600"
                borderRadius="14px"
                _hover={{ bg: cBg }}
              >
                Continue Browsing
              </Button>
            </VStack>
          </Box>
        </Container>
      </Box>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*  STATE 2: Loading / Preparing                                              */
  /* -------------------------------------------------------------------------- */
  if (isInitializing && displayItems.length === 0) {
    return (
      <Box bg={cBg} minH="80vh" py={20} px={4} textAlign="center">
        <Spinner size="xl" color={cPrimary} thickness="4px" speed="0.75s" />
        <Heading fontSize="lg" fontWeight="700" color={cText} mt={6} mb={1}>
          Preparing Your Order...
        </Heading>
        <Text fontSize="sm" color={cTextMuted}>
          Validating pricing, inventory, and delivery options
        </Text>
      </Box>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*  STATE 3: Cart is Empty (and not Buy Now)                                 */
  /* -------------------------------------------------------------------------- */
  if (!isBuyNow && displayItems.length === 0) {
    return (
      <Box bg={cBg} minH="80vh" py={{ base: 12, md: 20 }} px={4}>
        <Container maxW="md">
          <Box
            bg={cSurface}
            borderRadius="24px"
            p={{ base: 6, sm: 8 }}
            textAlign="center"
            border="1px solid"
            borderColor={cBorder}
            boxShadow="0 4px 20px -2px rgba(15, 23, 42, 0.05)"
          >
            <Flex
              w="64px"
              h="64px"
              borderRadius="full"
              bg={cBannerBg}
              color="#EF4444"
              align="center"
              justify="center"
              mx="auto"
              mb={4}
            >
              <Icon as={FiShoppingBag} boxSize={7} />
            </Flex>
            <Heading fontSize="xl" fontWeight="800" color={cText} mb={2}>
              Your Cart is Empty
            </Heading>
            <Text fontSize="sm" color={cTextMuted} mb={6}>
              You do not have any items ready for checkout. Add some items to your
              cart and proceed here.
            </Text>
            <Button
              as={NextLink}
              href="/products"
              w="full"
              h="46px"
              bg={cPrimary}
              color="#FFFFFF"
              fontWeight="700"
              borderRadius="14px"
              _hover={{ bg: cPrimaryHover }}
            >
              Explore Products
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*  MAIN CHECKOUT INTERFACE                                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <Box bg={cBg} minH="100vh" py={{ base: 4, md: 8 }} px={{ base: 2, sm: 4, lg: 6 }}>
      <Container maxW="container.xl" px={{ base: 2, sm: 4 }}>
        {/* Navigation Breadcrumb / Header */}
        <Flex
          justify="space-between"
          align="center"
          mb={{ base: 4, md: 6 }}
          wrap="wrap"
          gap={2}
        >
          <HStack spacing={3}>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Icon as={FiArrowLeft} />}
              onClick={() => router.back()}
              color={cTextMuted}
              _hover={{ color: cPrimary, bg: cPrimarySoft }}
              borderRadius="10px"
              px={3}
            >
              Back
            </Button>
            <Heading
              fontSize={{ base: "xl", sm: "24px" }}
              fontWeight="800"
              color={cText}
              letterSpacing="-0.02em"
            >
              Secure Checkout
            </Heading>
          </HStack>

          <HStack
            spacing={2}
            bg={cPrimarySoft}
            px={3}
            py={1.5}
            borderRadius="full"
            color={cPrimary}
            fontSize="xs"
            fontWeight="700"
          >
            <Icon as={FaShieldHalved} boxSize={3.5} />
            <Text>256-Bit SSL Encrypted</Text>
          </HStack>
        </Flex>

        {/* Optional Init Error Warning with Retry */}
        {initError && (
          <Box
            mb={6}
            bg="#FFFBEB"
            border="1px solid #FDE68A"
            borderRadius="16px"
            p={4}
          >
            <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
              <HStack spacing={3}>
                <Icon as={FiAlertCircle} color="#D97706" boxSize={5} />
                <Box>
                  <Text fontWeight="700" fontSize="sm" color="#92400E">
                    Notice regarding order preview
                  </Text>
                  <Text fontSize="xs" color="#B45309">
                    {initError} Pricing shown below is calculated from current item details.
                  </Text>
                </Box>
              </HStack>
              <Button
                size="xs"
                variant="outline"
                borderColor="#D97706"
                color="#D97706"
                leftIcon={<Icon as={FiRefreshCw} />}
                onClick={initOrder}
                isLoading={isInitializing}
              >
                Retry Sync
              </Button>
            </Flex>
          </Box>
        )}

        <Grid templateColumns={{ base: "1fr", lg: "1.45fr 1fr" }} gap={{ base: 4, lg: 7 }}>
          {/* ─────────────────────────────────────────────────────────────
              LEFT COLUMN: Delivery Address + Payment Method + Items Review
             ───────────────────────────────────────────────────────────── */}
          <GridItem>
            <VStack spacing={{ base: 4, md: 5 }} align="stretch">
              {/* 1. DELIVERY ADDRESS SECTION */}
              <Box
                bg={cSurface}
                borderRadius="20px"
                border="1px solid"
                borderColor={cBorderSubtle}
                p={{ base: 4, sm: 5 }}
                boxShadow="0 2px 10px rgba(0, 0, 0, 0.02)"
              >
                <Flex justify="space-between" align="center" mb={3.5}>
                  <HStack spacing={2.5} align="center">
                    <Flex
                      w="32px"
                      h="32px"
                      borderRadius="full"
                      bg={cPrimarySoft}
                      color={cPrimary}
                      align="center"
                      justify="center"
                    >
                      <Icon as={FaLocationDot} boxSize={3.5} />
                    </Flex>
                    <Box>
                      <Text fontWeight="800" fontSize="16px" color={cText}>
                        Delivery Address
                      </Text>
                      <Text fontSize="xs" color={cTextMuted}>
                        Where should we deliver your order?
                      </Text>
                    </Box>
                  </HStack>

                  {currentAddress && (
                    <Button
                      variant="unstyled"
                      color={cPrimary}
                      fontWeight="700"
                      fontSize="13px"
                      h="auto"
                      p={0}
                      _hover={{ textDecoration: "underline", color: cPrimaryHover }}
                      onClick={onAddressModalOpen}
                    >
                      Change
                    </Button>
                  )}
                </Flex>

                {currentAddress &&
                (currentAddress.addressLine1 || currentAddress.line1) ? (
                  <Box
                    bg={cBannerBg}
                    border="1px solid"
                    borderColor={cBannerBorder}
                    borderRadius="16px"
                    p={{ base: "14px", sm: "16px" }}
                    position="relative"
                    overflow="hidden"
                  >
                    <HouseIllustration />

                    <Box position="relative" zIndex={1} pr={{ base: "48px", sm: "64px" }}>
                      <HStack spacing={2} align="center" mb={1.5} wrap="wrap">
                        <Icon as={FaHouse} color="#E53E3E" boxSize={3.5} />
                        <Text fontWeight="800" fontSize="14px" color={cText}>
                          {currentAddress.name || currentAddress.fullName || "Primary Address"}
                        </Text>
                        <Badge
                          bg="#FCE7E7"
                          color="#E53E3E"
                          fontSize="10px"
                          fontWeight="800"
                          px="7px"
                          py="1.5px"
                          borderRadius="full"
                          letterSpacing="0.04em"
                        >
                          {currentAddress.isDefault ? "DEFAULT" : "SELECTED"}
                        </Badge>
                      </HStack>

                      <Text
                        fontSize="13px"
                        color={cTextSubtle}
                        lineHeight="1.5"
                        mb={2}
                      >
                        {[
                          currentAddress.addressLine1 || currentAddress.line1,
                          currentAddress.addressLine2 || currentAddress.line2,
                          currentAddress.city,
                          currentAddress.state,
                          currentAddress.postalCode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </Text>

                      {(currentAddress.phone || auth.user?.phone) && (
                        <HStack
                          spacing={1.5}
                          color={cTextSubtle}
                          fontSize="12px"
                          fontWeight="600"
                          align="center"
                        >
                          <Icon as={FaPhone} boxSize={3} color={cTextMuted} />
                          <Text>
                            Contact: {currentAddress.phone || auth.user?.phone}
                          </Text>
                        </HStack>
                      )}
                    </Box>
                  </Box>
                ) : (
                  <Box
                    border="2px dashed"
                    borderColor={cBorder}
                    bg={cActiveBg}
                    borderRadius="16px"
                    p={5}
                    textAlign="center"
                  >
                    <Icon as={FaLocationDot} color={cPrimary} boxSize={6} mb={2} />
                    <Text fontWeight="700" fontSize="14px" color={cText} mb={1}>
                      No Delivery Address Selected
                    </Text>
                    <Text fontSize="xs" color={cTextMuted} mb={4}>
                      Please add or select a shipping destination to proceed with checkout.
                    </Text>
                    <Button
                      size="sm"
                      bg={cPrimary}
                      color="#FFFFFF"
                      fontWeight="700"
                      borderRadius="12px"
                      _hover={{ bg: cPrimaryHover }}
                      leftIcon={<Icon as={FaPlus} />}
                      onClick={onAddressModalOpen}
                    >
                      Add Delivery Address
                    </Button>
                  </Box>
                )}
              </Box>

              {/* 2. PAYMENT METHOD SELECTION */}
              <Box
                bg={cSurface}
                borderRadius="20px"
                border="1px solid"
                borderColor={cBorderSubtle}
                p={{ base: 4, sm: 5 }}
                boxShadow="0 2px 10px rgba(0, 0, 0, 0.02)"
              >
                <Flex align="center" mb={3.5}>
                  <HStack spacing={2.5} align="center">
                    <Flex
                      w="32px"
                      h="32px"
                      borderRadius="full"
                      bg={cPrimarySoft}
                      color={cPrimary}
                      align="center"
                      justify="center"
                    >
                      <Icon as={FaCreditCard} boxSize={3.5} />
                    </Flex>
                    <Box>
                      <Text fontWeight="800" fontSize="16px" color={cText}>
                        Payment Method
                      </Text>
                      <Text fontSize="xs" color={cTextMuted}>
                        Choose how you would like to pay
                      </Text>
                    </Box>
                  </HStack>
                </Flex>

                <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
                  <VStack align="stretch" spacing={3}>
                    {/* COD Option */}
                    <Box
                      p={4}
                      border="1.5px solid"
                      borderRadius="16px"
                      borderColor={paymentMethod === "cod" ? cPrimary : cBorder}
                      bg={paymentMethod === "cod" ? cActiveBg : cSurface}
                      cursor="pointer"
                      transition="all 0.2s ease"
                      onClick={() => setPaymentMethod("cod")}
                      _hover={{ borderColor: cPrimary }}
                    >
                      <Flex justify="space-between" align="start">
                        <HStack spacing={3} align="flex-start">
                          <Radio
                            value="cod"
                            colorScheme="brand"
                            mt={1}
                            isChecked={paymentMethod === "cod"}
                          />
                          <Box>
                            <HStack spacing={2}>
                              <Icon as={FaMoneyBillWave} color="#0D9488" boxSize={4} />
                              <Text fontWeight="800" fontSize="14px" color={cText}>
                                Cash on Delivery (COD)
                              </Text>
                              <Badge
                                bg="#DCFCE7"
                                color="#15803D"
                                fontSize="10px"
                                fontWeight="800"
                                px={2}
                                py={0.5}
                                borderRadius="full"
                              >
                                Popular
                              </Badge>
                            </HStack>
                            <Text fontSize="xs" color={cTextMuted} mt={1}>
                              Pay conveniently with cash or UPI at your doorstep upon arrival.
                            </Text>
                          </Box>
                        </HStack>
                      </Flex>
                    </Box>

                    {/* Online Payment Option */}
                    <Box
                      p={4}
                      border="1.5px solid"
                      borderRadius="16px"
                      borderColor={paymentMethod === "online" ? cPrimary : cBorder}
                      bg={paymentMethod === "online" ? cActiveBg : cSurface}
                      cursor="pointer"
                      transition="all 0.2s ease"
                      onClick={() => setPaymentMethod("online")}
                      _hover={{ borderColor: cPrimary }}
                    >
                      <Flex justify="space-between" align="start">
                        <HStack spacing={3} align="flex-start">
                          <Radio
                            value="online"
                            colorScheme="brand"
                            mt={1}
                            isChecked={paymentMethod === "online"}
                          />
                          <Box>
                            <HStack spacing={2} wrap="wrap">
                              <Icon as={FaLock} color={cPrimary} boxSize={3.5} />
                              <Text fontWeight="800" fontSize="14px" color={cText}>
                                Online Payment (Razorpay)
                              </Text>
                              <Badge
                                bg={cPrimarySoft}
                                color={cPrimary}
                                fontSize="10px"
                                fontWeight="800"
                                px={2}
                                py={0.5}
                                borderRadius="full"
                              >
                                Instant
                              </Badge>
                            </HStack>
                            <Text fontSize="xs" color={cTextMuted} mt={1}>
                              Pay instantly via UPI (GPay, PhonePe, Paytm), Debit/Credit Cards, or Net Banking.
                            </Text>
                          </Box>
                        </HStack>
                      </Flex>
                    </Box>
                  </VStack>
                </RadioGroup>
              </Box>

              {/* 3. ORDER ITEMS REVIEW SECTION */}
              <Box
                bg={cSurface}
                borderRadius="20px"
                border="1px solid"
                borderColor={cBorderSubtle}
                p={{ base: 4, sm: 5 }}
                boxShadow="0 2px 10px rgba(0, 0, 0, 0.02)"
              >
                <Flex justify="space-between" align="center" mb={3.5}>
                  <HStack spacing={2.5} align="center">
                    <Flex
                      w="32px"
                      h="32px"
                      borderRadius="full"
                      bg={cPrimarySoft}
                      color={cPrimary}
                      align="center"
                      justify="center"
                    >
                      <Icon as={FiPackage} boxSize={4} />
                    </Flex>
                    <Box>
                      <Text fontWeight="800" fontSize="16px" color={cText}>
                        Review Items ({displayItems.length})
                      </Text>
                      <Text fontSize="xs" color={cTextMuted}>
                        Items included in this shipment
                      </Text>
                    </Box>
                  </HStack>
                </Flex>

                <VStack spacing={3} align="stretch">
                  {displayItems.map((item, idx) => (
                    <Flex
                      key={item.id || idx}
                      p={3}
                      border="1px solid"
                      borderColor={cBorder}
                      borderRadius="14px"
                      bg={cSurfaceElevated}
                      align="center"
                      justify="space-between"
                      gap={3}
                    >
                      <HStack spacing={3} align="center" flex="1" minW={0}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          w={{ base: "52px", sm: "60px" }}
                          h={{ base: "52px", sm: "60px" }}
                          borderRadius="10px"
                          objectFit="cover"
                          bg={cBorder}
                          fallbackSrc={FALLBACK_IMAGE}
                        />
                        <Box minW={0} flex="1">
                          <Text
                            fontWeight="700"
                            fontSize="14px"
                            color={cText}
                            noOfLines={1}
                            title={item.name}
                          >
                            {item.name}
                          </Text>

                          <HStack spacing={2} mt={1} wrap="wrap">
                            <Badge
                              bg={cPrimarySoft}
                              color={cPrimary}
                              fontSize="11px"
                              fontWeight="700"
                              px={2}
                              py={0.5}
                              borderRadius="md"
                            >
                              Qty: {item.quantity}
                            </Badge>
                            {item.variant && (
                              <Text fontSize="11px" color={cTextMuted}>
                                {typeof item.variant === "object"
                                  ? Object.entries(item.variant)
                                      .map(([k, v]) => `${k}: ${v}`)
                                      .join(", ")
                                  : String(item.variant)}
                              </Text>
                            )}
                          </HStack>
                        </Box>
                      </HStack>

                      <Box textAlign="right" flexShrink={0}>
                        <Text
                          fontWeight="800"
                          fontSize="15px"
                          color={cPrimary}
                          letterSpacing="-0.01em"
                        >
                          ₹{item.total}
                        </Text>
                        {item.quantity > 1 && (
                          <Text fontSize="11px" color={cTextMuted}>
                            (₹{item.unitPrice} each)
                          </Text>
                        )}
                      </Box>
                    </Flex>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </GridItem>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT COLUMN: Sticky Order Summary & Place Order CTA
             ───────────────────────────────────────────────────────────── */}
          <GridItem>
            <Box
              bg={cSurface}
              borderRadius="20px"
              border="1px solid"
              borderColor={cBorderSubtle}
              p={{ base: 4, sm: 6 }}
              boxShadow="0 4px 20px -2px rgba(15, 23, 42, 0.04)"
              position={{ lg: "sticky" }}
              top={{ lg: "96px" }}
            >
              {/* Header */}
              <HStack spacing={2.5} align="center" mb={4}>
                <Flex
                  w="32px"
                  h="32px"
                  borderRadius="full"
                  bg={cPrimarySoft}
                  color={cPrimary}
                  align="center"
                  justify="center"
                >
                  <Icon as={IoReceiptOutline} boxSize={4} />
                </Flex>
                <Heading fontSize="17px" fontWeight="800" color={cText}>
                  Order Summary
                </Heading>
              </HStack>

              {/* Price Breakdown */}
              <VStack spacing={3} align="stretch" mb={4}>
                <Flex justify="space-between" align="center">
                  <Text fontSize="14px" color={cTextMuted}>
                    Items Subtotal
                  </Text>
                  <Text fontSize="15px" fontWeight="700" color={cText}>
                    ₹{pricing.subtotal}
                  </Text>
                </Flex>

                <Flex justify="space-between" align="center">
                  <HStack spacing={1.5} align="center">
                    <Text fontSize="14px" color={cTextMuted}>
                      Delivery Fee
                    </Text>
                    {pricing.isFreeDelivery && (
                      <Icon as={FiTruck} color="#15803D" boxSize={3.5} />
                    )}
                  </HStack>
                  <Text
                    fontSize="14px"
                    fontWeight="800"
                    color={pricing.isFreeDelivery ? "#15803D" : cText}
                  >
                    {pricing.isFreeDelivery ? "FREE" : `₹${pricing.deliveryFee}`}
                  </Text>
                </Flex>

                {pricing.tax > 0 && (
                  <Flex justify="space-between" align="center">
                    <Text fontSize="14px" color={cTextMuted}>
                      Estimated Tax
                    </Text>
                    <Text fontSize="14px" fontWeight="700" color={cText}>
                      ₹{pricing.tax.toFixed(0)}
                    </Text>
                  </Flex>
                )}
              </VStack>

              {/* Total Box */}
              <Box
                bg={cPrimarySoft}
                borderRadius="14px"
                p="14px 18px"
                mb={5}
                border="1px solid"
                borderColor={cBorder}
              >
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text fontSize="13px" fontWeight="700" color={cPrimary}>
                      Total Payable
                    </Text>
                    <Text fontSize="11px" color={cTextSubtle}>
                      Inclusive of all taxes
                    </Text>
                  </Box>
                  <Text
                    fontSize="22px"
                    fontWeight="900"
                    color={cPrimary}
                    letterSpacing="-0.02em"
                  >
                    ₹{pricing.total}
                  </Text>
                </Flex>
              </Box>

              {/* Place Order CTA Button */}
              <Button
                w="full"
                h="52px"
                bg={cPrimary}
                color="#FFFFFF"
                fontWeight="800"
                fontSize="15px"
                borderRadius="16px"
                boxShadow="0 4px 14px 0 rgba(6, 95, 104, 0.35)"
                _hover={{
                  bg: cPrimaryHover,
                  boxShadow: "0 6px 18px 0 rgba(6, 95, 104, 0.45)",
                  transform: "translateY(-1px)",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
                isLoading={isProcessing}
                loadingText="Processing Order..."
                onClick={handlePlaceOrder}
                leftIcon={<Icon as={FaLock} boxSize={3.5} />}
              >
                {paymentMethod === "cod"
                  ? `Confirm & Place Order (₹${pricing.total})`
                  : `Pay ₹${pricing.total} Securely`}
              </Button>

              <Text
                fontSize="11px"
                color={cTextMuted}
                mt={3}
                textAlign="center"
                lineHeight="tall"
              >
                By placing this order, you agree to our Terms of Service & Privacy Policy.
              </Text>

              <Divider my={4} borderColor={cBorder} />

              {/* Trust Badges */}
              <VStack spacing={2.5} align="stretch">
                <HStack spacing={2.5} color={cTextSubtle} fontSize="12px">
                  <Icon as={FiShield} color={cPrimary} boxSize={4} />
                  <Text fontWeight="600">100% Safe & Secure Checkout</Text>
                </HStack>
                <HStack spacing={2.5} color={cTextSubtle} fontSize="12px">
                  <Icon as={FiRotateCcw} color={cPrimary} boxSize={4} />
                  <Text fontWeight="600">7-Day Easy Returns & Replacements</Text>
                </HStack>
                <HStack spacing={2.5} color={cTextSubtle} fontSize="12px">
                  <Icon as={FiHeadphones} color={cPrimary} boxSize={4} />
                  <Text fontWeight="600">24/7 Dedicated Customer Support</Text>
                </HStack>
              </VStack>
            </Box>
          </GridItem>
        </Grid>

        {/* Address Selection Modal (BottomSheetDrawer on mobile, Modal on desktop) */}
        <AddressModal
          isOpen={isAddressModalOpen}
          onClose={onAddressModalClose}
          addresses={addresses}
          selectedAddress={selectedAddress}
          onSelectAddress={handleSelectAddress}
          onAddNewAddress={handleAddNewAddress}
          onUpdateAddress={handleUpdateAddress}
          onDeleteAddress={handleDeleteAddress}
        />
      </Container>
    </Box>
  );
});

export default CheckoutClient;
