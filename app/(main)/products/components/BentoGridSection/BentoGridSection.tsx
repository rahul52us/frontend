import type { BoxProps } from '@chakra-ui/react';
import {
  Badge,
  Box,
  Button,
  chakra,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  // keyframes,
  Skeleton,
  Text,
  useBreakpointValue,
  useColorModeValue,
  usePrefersReducedMotion,
  useToast,
  VisuallyHidden,
  VStack,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { IconType } from 'react-icons';
import {
  FaBabyCarriage,
  FaBook,
  FaCamera,
  FaGamepad,
  FaGift,
  FaHeart,
  FaHome,
  FaMobileAlt,
  FaRegHeart,
  FaShoePrints,
  FaShoppingBag,
  FaStar,
  FaTshirt,
} from 'react-icons/fa';
import {
  FiArrowRight,
  FiCheck,
  FiMaximize2,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTruck,
  FiZap,
} from 'react-icons/fi';
import categoryStore from '../../../../store/categoryStore/categoryStore';
import { shopStore } from '../../../../store/shopStore/shopStore';

/* ============================================================
   Types + dummy data
   ============================================================ */
type ShopCategory = 'Electronics' | 'Fashion' | 'Lifestyle' | 'Accessories' | 'Gadgets';
type Filter = 'All' | ShopCategory;
type Variant = 'tall' | 'std' | 'mini' | 'wide';
interface Tint { l: string; d: string }

interface Product {
  id: string;
  name: string;
  category: ShopCategory;
  price: number;
  compareAt: number;
  rating: number;
  reviews: number;
  image: string;
  blurb: string;
  tag?: string;
  isNew?: boolean;
}

const CURRENCY = { locale: 'en-IN', code: 'INR' }; // change to localise prices
const money = new Intl.NumberFormat(CURRENCY.locale, {
  style: 'currency',
  currency: CURRENCY.code,
  maximumFractionDigits: 0,
});
const fmt = (n: number) => money.format(n);
const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const pct = (p: Product) => Math.round((1 - p.price / p.compareAt) * 100);

const img = (id: string, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

const HERO: Product = {
  id: 'hero-aria',
  name: 'Aria Max',
  category: 'Electronics',
  price: 14999,
  compareAt: 21999,
  rating: 4.8,
  reviews: 2143,
  image: img('1505740420928-5e560c06d30e', 1000),
  blurb: 'Wireless noise-cancelling headphones with 40-hour battery and studio-tuned sound.',
  tag: "Editor's pick",
};

const PRODUCTS: Product[] = [
  { id: 'p-watch', name: 'Chrono Steel Watch', category: 'Accessories', price: 8499, compareAt: 12999, rating: 4.6, reviews: 980, image: img('1523275335684-37898b6baf30'), blurb: 'Brushed steel case, sapphire glass and a 5-year warranty.', tag: 'Bestseller' },
  { id: 'p-sneaker', name: 'Pulse Runner Sneakers', category: 'Fashion', price: 6299, compareAt: 8999, rating: 4.7, reviews: 1320, image: img('1542291026-7eec264c27ff'), blurb: 'Light foam midsole with a breathable knit upper for all-day wear.', isNew: true },
  { id: 'p-camera', name: 'Frame 35 Mirrorless', category: 'Electronics', price: 52999, compareAt: 59999, rating: 4.9, reviews: 412, image: img('1516035069371-29a1b244cc32'), blurb: '24MP sensor, 4K video and fast autofocus in a compact body.' },
  { id: 'p-shades', name: 'Solar Shade Sunglasses', category: 'Accessories', price: 2499, compareAt: 3999, rating: 4.5, reviews: 640, image: img('1572635196237-14b3f281503f'), blurb: 'Polarised lenses with UV400 protection and a featherweight frame.', isNew: true },
  { id: 'p-pack', name: 'Trail Day Backpack', category: 'Fashion', price: 3799, compareAt: 5499, rating: 4.6, reviews: 770, image: img('1553062407-98eeb64c6a62'), blurb: 'Water-resistant 24L pack with a padded laptop sleeve.' },
  { id: 'p-smartwatch', name: 'Orbit Smart Watch', category: 'Gadgets', price: 11999, compareAt: 15999, rating: 4.4, reviews: 1510, image: img('1546868871-7041f2a55e12'), blurb: 'AMOLED display, GPS, heart-rate tracking and 7-day battery.', tag: 'Hot', isNew: true },
  { id: 'p-speaker', name: 'Echo Cube Speaker', category: 'Gadgets', price: 4999, compareAt: 6999, rating: 4.5, reviews: 860, image: img('1608043152269-423dbba4e7e8'), blurb: 'Pocket-sized 360° sound with 12 hours of playtime.' },
  { id: 'p-planter', name: 'Fern & Clay Planter', category: 'Lifestyle', price: 1299, compareAt: 1799, rating: 4.7, reviews: 305, image: img('1485955900006-10f4d324d411'), blurb: 'Hand-finished ceramic planter with a drainage tray.' },
  { id: 'p-mug', name: 'Slow Morning Mug Set', category: 'Lifestyle', price: 899, compareAt: 1299, rating: 4.8, reviews: 1180, image: img('1514228742587-6b1558fcca3d'), blurb: 'Set of two stoneware mugs, dishwasher and microwave safe.' },
  { id: 'p-jacket', name: 'Moto Leather Jacket', category: 'Fashion', price: 12999, compareAt: 17999, rating: 4.6, reviews: 276, image: img('1551028719-00167b16eac5'), blurb: 'Full-grain leather with a quilted lining and YKK zips.' },
  { id: 'p-keys', name: 'K75 Mechanical Keyboard', category: 'Gadgets', price: 7499, compareAt: 9499, rating: 4.7, reviews: 534, image: img('1587829741301-dc798b83add3'), blurb: 'Hot-swappable switches, gasket mount and wireless mode.', isNew: true },
  { id: 'p-parfum', name: 'Maison Eau de Parfum', category: 'Lifestyle', price: 3299, compareAt: 4499, rating: 4.6, reviews: 421, image: img('1541643600914-78b084683601'), blurb: 'Warm amber and cedar, 50ml, long-lasting.' },
  { id: 'p-tote', name: 'Everyday Leather Tote', category: 'Accessories', price: 5499, compareAt: 7999, rating: 4.5, reviews: 389, image: img('1548036328-c9fa89d128fa'), blurb: 'Structured tote with an inner zip pocket and suede lining.' },
  { id: 'p-laptop', name: 'Slate Pro 14 Laptop', category: 'Electronics', price: 74999, compareAt: 84999, rating: 4.8, reviews: 698, image: img('1496181133206-80ce9b88a853'), blurb: '14" 2.8K display, 16GB RAM, all-day battery.' },
  { id: 'p-phone', name: 'Nova X Smartphone', category: 'Electronics', price: 29999, compareAt: 34999, rating: 4.5, reviews: 1904, image: img('1511707171634-5f897ff02aa9'), blurb: '120Hz OLED, 50MP dual camera and 65W fast charging.' },
];

const FILTERS: Filter[] = ['All', 'Electronics', 'Fashion', 'Lifestyle', 'Accessories', 'Gadgets'];
const FALLBACK_IMAGE = 'https://picsum.photos/id/20/600/400';

/* ============================================================
   Design tokens + motion
   ============================================================ */
const C = { ultra: '#3A36E8', citron: '#D8F34A', coral: '#FF5A5F', ink: '#13152B', mist: '#ffffffff', night: '#0B0D1A' };
const TINTS: Tint[] = [
  { l: '#E3E0FF', d: '#25225C' },
  { l: '#DDF5E8', d: '#173A2E' },
  { l: '#FFE1DE', d: '#46211F' },
  { l: '#FFF0C2', d: '#3F3513' },
  { l: '#DCEBFF', d: '#17304F' },
];
const surface = { bg: 'white', color: C.ink, _dark: { bg: '#171A33', color: '#F2F3FF' } };
const mutedText = { color: '#5B6078', _dark: { color: '#9AA0BF' } };

const fadeUp = keyframes`from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}`;
const pop = keyframes`0%{transform:scale(1)}40%{transform:scale(1.32)}100%{transform:scale(1)}`;
const floatY = keyframes`0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-5px) rotate(-4deg)}`;
const sweep = keyframes`from{transform:translateX(-100%)}to{transform:translateX(100%)}`;

const LIFT = {
  '@media (hover: hover) and (prefers-reduced-motion: no-preference)': {
    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 18px 40px rgba(19,21,43,.18)' },
  },
};

const useMotion = () => {
  const reduced = usePrefersReducedMotion();
  return { reduced, anim: (v: string) => (reduced ? undefined : v) };
};

const useParallax = (ref: React.RefObject<HTMLElement>, strength: number, disabled: boolean) => {
  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const host = el.parentElement;
      if (!host) return;
      const r = host.getBoundingClientRect();
      const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      el.style.transform = `translate3d(0, ${(-p * strength).toFixed(1)}px, 0) scale(1.1)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, strength, disabled]);
};

const useCountdown = (seconds: number) => {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    const id = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : seconds)), 1000);
    return () => clearInterval(id);
  }, [seconds]);
  return [Math.floor(left / 3600), Math.floor((left % 3600) / 60), left % 60].map((n) => String(n).padStart(2, '0'));
};

/* ============================================================
   Helpers (existing category logic)
   ============================================================ */
const getCategoryIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('fruit') || lower.includes('vegetable')) return FaGift;
  if (lower.includes('sweet') || lower.includes('dessert')) return FaStar;
  if (lower.includes('beauty')) return FaHeart;
  if (lower.includes('snack')) return FaShoppingBag;
  if (lower.includes('mobile') || lower.includes('electronics')) return FaMobileAlt;
  if (lower.includes('clothing') || lower.includes('fashion')) return FaTshirt;
  if (lower.includes('shoe') || lower.includes('footwear')) return FaShoePrints;
  if (lower.includes('home') || lower.includes('decor')) return FaHome;
  if (lower.includes('baby') || lower.includes('toy')) return FaBabyCarriage;
  if (lower.includes('game') || lower.includes('gaming')) return FaGamepad;
  if (lower.includes('book') || lower.includes('stationery')) return FaBook;
  if (lower.includes('camera') || lower.includes('audio')) return FaCamera;
  return FaGift;
};

const getCategoryColor = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('fruit')) return 'green';
  if (lower.includes('dairy')) return 'cyan';
  if (lower.includes('sweet')) return 'pink';
  if (lower.includes('beauty')) return 'purple';
  if (lower.includes('snack')) return 'orange';
  if (lower.includes('mobile')) return 'blue';
  if (lower.includes('clothing')) return 'teal';
  if (lower.includes('electronics')) return 'cyan';
  if (lower.includes('home')) return 'yellow';
  if (lower.includes('baby')) return 'pink';
  return 'blue';
};

const stableDiscount = (id: any) => 20 + ([...id].reduce((a, c) => a + c.charCodeAt(0), 0) % 30);

const assignVariants = (n: number): Variant[] => {
  const out: Variant[] = [];
  let i = 0;
  let g = 0;
  while (i < n) {
    const r = n - i;
    const phase = g % 3;
    if (phase === 0 && r >= 3) { out.push('tall', 'std', 'mini'); i += 3; }
    else if (phase === 1 || r === 1) { out.push('wide'); i += 1; }
    else { out.push('std', 'std'); i += 2; }
    g += 1;
  }
  return out.slice(0, n);
};

const ROWS: Record<Variant, number> = { tall: 18, std: 12, mini: 6, wide: 9 };

/* ============================================================
   Small building blocks
   ============================================================ */
const SafeImage = ({
  src, alt, tint, icon = FiShoppingBag, ...rest
}: { src: string; alt: string; tint: Tint; icon?: IconType } & BoxProps) => {
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');
  const { anim } = useMotion();
  return (
    <Box position="absolute" inset={0} overflow="hidden" bg={tint.l} _dark={{ bg: tint.d }} {...rest}>
      {state !== 'error' && (
        <Image
          ref={(el) => { if (el && el.complete && el.naturalWidth > 0 && state === 'loading') setState('ok'); }}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          ignoreFallback
          w="100%"
          h="100%"
          objectFit="cover"
          opacity={state === 'ok' ? 1 : 0}
          transition="opacity .45s ease, transform .7s cubic-bezier(.2,.7,.2,1)"
          _groupHover={{ transform: 'scale(1.06)' }}
          onLoad={() => setState('ok')}
          onError={() => setState('error')}
        />
      )}
      {state === 'loading' && (
        <Box position="absolute" inset={0} overflow="hidden" pointerEvents="none">
          <Box
            position="absolute"
            inset={0}
            bg="whiteAlpha.500"
            _dark={{ bg: 'whiteAlpha.100' }}
            animation={anim(`${sweep} 1.4s ease-in-out infinite`)}
            style={{ maskImage: 'linear-gradient(90deg, transparent, #000, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000, transparent)' }}
          />
        </Box>
      )}
      {state === 'error' && (
        <Flex position="absolute" inset={0} align="center" justify="center" color={C.ultra} _dark={{ color: 'whiteAlpha.700' }}>
          <Icon as={icon} boxSize="34%" maxW="64px" opacity={0.7} />
        </Flex>
      )}
    </Box>
  );
};

const Hit = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <chakra.button
    type="button"
    aria-label={label}
    onClick={onClick}
    position="absolute"
    inset={0}
    zIndex={1}
    borderRadius="inherit"
    _focusVisible={{ outline: '3px solid', outlineColor: C.ultra, outlineOffset: '-3px' }}
  />
);

const Tile = ({ i = 0, children, ...rest }: BoxProps & { i?: number }) => {
  const { anim } = useMotion();
  return (
    <Box
      role="group"
      position="relative"
      overflow="hidden"
      animation={anim(`${fadeUp} .55s cubic-bezier(.2,.8,.2,1) backwards`)}
      style={{ animationDelay: `${Math.min(i, 10) * 55}ms` }}
      transition="transform .25s ease, box-shadow .25s ease"
      sx={LIFT}
      _active={{ transform: 'scale(.975)' }}
      {...rest}
    >
      {children}
    </Box>
  );
};

const WishButton = ({ liked, onToggle, label, size = 38 }: { liked: boolean; onToggle: (e: React.MouseEvent) => void; label: string; size?: number }) => {
  const { anim } = useMotion();
  return (
    <IconButton
      aria-label={label}
      aria-pressed={liked}
      onClick={onToggle}
      variant="unstyled"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      isRound
      boxSize={`${size}px`}
      minW={`${size}px`}
      bg="whiteAlpha.900"
      color={liked ? C.coral : C.ink}
      boxShadow="0 2px 10px rgba(19,21,43,.15)"
      animation={liked ? anim(`${pop} .35s ease`) : undefined}
      _active={{ transform: 'scale(.9)' }}
      icon={<Icon as={liked ? FaHeart : FaRegHeart} boxSize={size > 34 ? '16px' : '14px'} />}
    />
  );
};

const AddButton = ({ added, onAdd, size = 36, label }: { added: boolean; onAdd: () => void; size?: number; label: string }) => {
  const { anim } = useMotion();
  return (
    <IconButton
      aria-label={label}
      onClick={(e) => { e.stopPropagation(); onAdd(); }}
      variant="unstyled"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      isRound
      boxSize={`${size}px`}
      minW={`${size}px`}
      bg={added ? '#1F9D63' : C.ink}
      color="white"
      _dark={{ bg: added ? '#1F9D63' : C.citron, color: added ? 'white' : C.ink }}
      animation={added ? anim(`${pop} .45s ease`) : undefined}
      transition="background .2s"
      _active={{ transform: 'scale(.9)' }}
      icon={<Icon as={added ? FiCheck : FiPlus} boxSize={size > 34 ? 5 : 4} />}
    />
  );
};

const Rating = ({ p }: { p: Product }) => (
  <HStack spacing="3px">
    <Icon as={FaStar} color="#F5B301" boxSize="11px" />
    <Text fontSize="11px" fontWeight={700}>{p.rating.toFixed(1)}</Text>
    <Text fontSize="11px" {...mutedText}>({compact.format(p.reviews)})</Text>
  </HStack>
);

const Qty = ({ value, onChange }: { value: number; onChange: (n: number) => void }) => (
  <HStack spacing={1} borderWidth="1px" borderColor="blackAlpha.200" _dark={{ borderColor: 'whiteAlpha.300' }} borderRadius="full" p="3px">
    <IconButton aria-label="Decrease quantity" onClick={() => onChange(value - 1)} variant="ghost" isRound size="sm" icon={<FiMinus />} />
    <Text minW="22px" textAlign="center" fontWeight={700} fontSize="15px" aria-live="polite">{value}</Text>
    <IconButton aria-label="Increase quantity" onClick={() => onChange(value + 1)} variant="ghost" isRound size="sm" icon={<FiPlus />} />
  </HStack>
);

/* ============================================================
   Bento tiles
   ============================================================ */
interface TileActions {
  liked: (id: string) => boolean;
  onLike: (id: string, e: React.MouseEvent) => void;
  onAdd: (id: string, qty?: number) => void;
  isAdded: (id: string) => boolean;
  onOpen: (p: Product) => void;
}

const HeroCard = ({ p, actions }: { p: Product; actions: TileActions }) => {
  const { anim, reduced } = useMotion();
  const parRef = useRef<HTMLDivElement>(null);
  useParallax(parRef, 22, reduced);
  const tint = TINTS[0];
  return (
    <Tile
      order={0}
      gridColumn="span 2"
      gridRow={{ base: 'span 21', md: 'span 22' }}
      borderRadius="32px"
      bg={C.ultra}
      color="white"
    >
      <Text
        aria-hidden
        position="absolute"
        left="-6px"
        bottom={{ base: '62px', md: '70px' }}
        fontSize={{ base: '120px', md: '180px' }}
        fontWeight={900}
        lineHeight={0.8}
        letterSpacing="-0.06em"
        color="whiteAlpha.200"
        userSelect="none"
        pointerEvents="none"
      >
        sonic
      </Text>

      <Box
        position="absolute"
        right={{ base: '-26px', md: '-20px' }}
        top={{ base: '86px', md: '70px' }}
        w={{ base: '74%', md: '58%' }}
        sx={{ aspectRatio: '1' }}
        borderRadius="46% 54% 42% 58% / 52% 44% 56% 48%"
        overflow="hidden"
        boxShadow="0 24px 60px rgba(8,6,80,.45)"
        zIndex={0}
      >
        <Box ref={parRef} position="absolute" inset={0} willChange="transform" style={{ transform: 'scale(1.1)' }}>
          <SafeImage src={p.image} alt={p.name} tint={tint} icon={FiZap} />
        </Box>
      </Box>

      <Hit label={`Quick view ${p.name}`} onClick={() => actions.onOpen(p)} />

      <Box position="absolute" top={{ base: '16px', md: '24px' }} left={{ base: '16px', md: '24px' }} zIndex={2} pointerEvents="none" maxW="62%">
        <Badge bg={C.citron} color={C.ink} borderRadius="full" px={3} py="3px" textTransform="none" fontSize="11px" fontWeight={700}>
          {p.tag}
        </Badge>
        <Heading as="h2" mt={2} fontSize={{ base: '36px', md: '56px' }} lineHeight={0.95} fontWeight={700} letterSpacing="-0.04em">
          {p.name}
        </Heading>
        <Text mt={2} fontSize={{ base: '13px', md: '15px' }} opacity={0.82} lineHeight={1.35} noOfLines={3}>
          {p.blurb}
        </Text>
      </Box>

      <HStack
        position="absolute"
        right="14px"
        top={{ base: '76px', md: '24px' }}
        zIndex={2}
        bg="white"
        color={C.ink}
        borderRadius="full"
        px="10px"
        py="4px"
        spacing="4px"
        boxShadow="0 6px 18px rgba(8,6,80,.3)"
        pointerEvents="none"
      >
        <Icon as={FaStar} color="#F5B301" boxSize="12px" />
        <Text fontSize="12px" fontWeight={700}>{p.rating.toFixed(1)}</Text>
        <Text fontSize="11px" color="#5B6078">{compact.format(p.reviews)} reviews</Text>
      </HStack>

      <Box
        position="absolute"
        left="14px"
        bottom={{ base: '84px', md: '96px' }}
        zIndex={2}
        bg={C.citron}
        color={C.ink}
        borderRadius="18px"
        px="14px"
        py="8px"
        animation={anim(`${floatY} 4.5s ease-in-out infinite`)}
        style={reduced ? { transform: 'rotate(-4deg)' } : undefined}
        boxShadow="0 10px 24px rgba(8,6,80,.35)"
        pointerEvents="none"
      >
        <Text fontSize={{ base: '22px', md: '28px' }} fontWeight={900} lineHeight={1} letterSpacing="-0.03em">{fmt(p.price)}</Text>
        <Text fontSize="11px" textDecoration="line-through" opacity={0.65}>{fmt(p.compareAt)}</Text>
        <Box position="absolute" top="-10px" right="-12px" bg={C.coral} color="white" borderRadius="full" px="8px" py="2px" fontSize="11px" fontWeight={700}>
          -{pct(p)}%
        </Box>
      </Box>

      <HStack position="absolute" left="14px" right="14px" bottom="14px" spacing={2} zIndex={2}>
        <Button
          flex={1}
          h="48px"
          borderRadius="full"
          bg={actions.isAdded(p.id) ? '#1F9D63' : 'white'}
          color={actions.isAdded(p.id) ? 'white' : C.ink}
          _hover={{ bg: actions.isAdded(p.id) ? '#1F9D63' : C.citron }}
          _active={{ transform: 'scale(.97)' }}
          fontWeight={700}
          leftIcon={<Icon as={actions.isAdded(p.id) ? FiCheck : FiShoppingBag} />}
          onClick={() => actions.onAdd(p.id)}
        >
          {actions.isAdded(p.id) ? 'Added' : 'Add to cart'}
        </Button>
        <IconButton
          aria-label={`Quick view ${p.name}`}
          onClick={() => actions.onOpen(p)}
          h="48px"
          w="48px"
          isRound
          variant="outline"
          color="white"
          borderColor="whiteAlpha.600"
          _hover={{ bg: 'whiteAlpha.200' }}
          icon={<FiMaximize2 />}
        />
        <WishButton liked={actions.liked(p.id)} onToggle={(e) => actions.onLike(p.id, e)} label={`Wishlist ${p.name}`} size={48} />
      </HStack>
    </Tile>
  );
};

const PromoCard = ({ onShop }: { onShop: () => void }) => {
  const [h, m, s] = useCountdown(2 * 3600 + 14 * 60 + 9);
  return (
    <Tile
      order={1}
      gridColumn="span 2"
      gridRow={{ base: 'span 7', md: 'span 10' }}
      borderRadius="28px"
      bg={C.citron}
      color={C.ink}
      p={{ base: '14px', md: '24px' }}
    >
      <Text aria-hidden position="absolute" right="-6px" bottom={{ base: '-52px', md: '-70px' }} fontSize={{ base: '150px', md: '220px' }} fontWeight={900} lineHeight={1} opacity={0.14} transform="rotate(12deg)" pointerEvents="none">
        %
      </Text>
      <Flex h="100%" justify="space-between" align="stretch" position="relative" zIndex={1} gap={2}>
        <Flex direction="column" justify="space-between" minW={0}>
          <Box>
            <Heading as="h3" fontSize={{ base: '20px', md: '34px' }} fontWeight={700} letterSpacing="-0.03em" lineHeight={1}>
              Flash sale
            </Heading>
            <Text mt="4px" fontSize={{ base: '12px', md: '15px' }} fontWeight={600}>Up to 40% off gadgets</Text>
          </Box>
          <Button
            alignSelf="flex-start"
            size="sm"
            h="34px"
            px={4}
            borderRadius="full"
            bg={C.ink}
            color="white"
            _hover={{ bg: C.ultra }}
            _active={{ transform: 'scale(.96)' }}
            rightIcon={<FiArrowRight />}
            onClick={onShop}
          >
            Shop deals
          </Button>
        </Flex>
        <HStack spacing="6px" align="flex-start" aria-label={`Sale ends in ${h} hours ${m} minutes ${s} seconds`} role="timer">
          {[[h, 'hr'], [m, 'min'], [s, 'sec']].map(([v, l]) => (
            <Flex key={l} direction="column" align="center" justify="center" bg={C.ink} color={C.citron} borderRadius="12px" w={{ base: '38px', md: '56px' }} h={{ base: '48px', md: '72px' }}>
              <Text fontSize={{ base: '18px', md: '28px' }} fontWeight={700} lineHeight={1} sx={{ fontVariantNumeric: 'tabular-nums' }}>{v}</Text>
              <Text fontSize="9px" opacity={0.7}>{l}</Text>
            </Flex>
          ))}
        </HStack>
      </Flex>
    </Tile>
  );
};

const JustInCard = ({ items, orderBase, onOpen, onAll }: { items: Product[]; orderBase: number; onOpen: (p: Product) => void; onAll: () => void }) => (
  <Tile
    order={{ base: orderBase, md: 2 }}
    gridColumn="span 2"
    gridRow={{ base: 'span 10', md: 'span 12' }}
    borderRadius="28px"
    p={{ base: '14px', md: '20px' }}
    {...surface}
  >
    <Flex justify="space-between" align="center" mb="10px">
      <Text fontWeight={700} fontSize={{ base: '16px', md: '20px' }} letterSpacing="-0.02em">New this week</Text>
      <Button variant="link" size="xs" color={C.ultra} _dark={{ color: C.citron }} rightIcon={<FiArrowRight />} onClick={onAll}>All picks</Button>
    </Flex>
    <Box display="grid" gridTemplateColumns="repeat(3, minmax(0, 1fr))" gap="8px">
      {items.map((p, i) => (
        <chakra.button
          key={p.id}
          type="button"
          textAlign="left"
          onClick={() => onOpen(p)}
          aria-label={`Quick view ${p.name}`}
          role="group"
          minW={0}
          borderRadius="16px"
          _focusVisible={{ outline: '3px solid', outlineColor: C.ultra, outlineOffset: '2px' }}
          _active={{ transform: 'scale(.96)' }}
          transition="transform .2s"
        >
          <Box position="relative" h={{ base: '84px', md: '130px' }} borderRadius="16px" overflow="hidden">
            <SafeImage src={p.image} alt={p.name} tint={TINTS[(i + 2) % TINTS.length]} />
          </Box>
          <Text mt="5px" fontSize="12px" fontWeight={700} noOfLines={1}>{p.name}</Text>
          <Text fontSize="11px" fontWeight={700} color={C.ultra} _dark={{ color: C.citron }}>{fmt(p.price)}</Text>
        </chakra.button>
      ))}
    </Box>
  </Tile>
);

const ProductTile = ({ p, variant, i, order, actions }: { p: Product; variant: Variant; i: number; order: number; actions: TileActions }) => {
  const tint = TINTS[i % TINTS.length];
  const liked = actions.liked(p.id);
  const added = actions.isAdded(p.id);
  const chip = p.tag || `${pct(p)}% off`;
  const isWide = variant === 'wide';
  const isMini = variant === 'mini';

  const chipEl = (
    <Badge bg={p.tag ? C.citron : C.coral} color={p.tag ? C.ink : 'white'} borderRadius="full" px="8px" py="2px" fontSize="10px" fontWeight={700} textTransform="none" boxShadow="0 2px 8px rgba(19,21,43,.2)">
      {chip}
    </Badge>
  );

  if (isWide) {
    return (
      <Tile i={i} order={order} gridColumn="span 2" gridRow={`span ${ROWS.wide}`} borderRadius="26px" {...surface}>
        <Flex h="100%">
          <Box position="relative" w="46%" flexShrink={0}>
            <SafeImage src={p.image} alt={p.name} tint={tint} />
            <Box position="absolute" left="8px" bottom="8px" zIndex={2} pointerEvents="none">{chipEl}</Box>
          </Box>
          <Flex flex={1} minW={0} direction="column" justify="space-between" p="12px">
            <Box>
              <Text fontSize="11px" {...mutedText}>{p.category}</Text>
              <Text fontWeight={700} fontSize={{ base: '15px', md: '17px' }} lineHeight={1.15} noOfLines={2} letterSpacing="-0.01em">{p.name}</Text>
              <Box mt="4px"><Rating p={p} /></Box>
            </Box>
            <Flex justify="space-between" align="flex-end" gap={2}>
              <Box>
                <Text fontWeight={700} fontSize="16px" lineHeight={1.1}>{fmt(p.price)}</Text>
                <Text fontSize="11px" textDecoration="line-through" {...mutedText}>{fmt(p.compareAt)}</Text>
              </Box>
              <Box position="relative" zIndex={3}><AddButton added={added} onAdd={() => actions.onAdd(p.id)} label={`Add ${p.name} to cart`} /></Box>
            </Flex>
          </Flex>
        </Flex>
        <Hit label={`Quick view ${p.name}`} onClick={() => actions.onOpen(p)} />
        <Box position="absolute" top="8px" left="8px" zIndex={3}>
          <WishButton liked={liked} onToggle={(e) => actions.onLike(p.id, e)} label={`Wishlist ${p.name}`} size={34} />
        </Box>
      </Tile>
    );
  }

  return (
    <Tile i={i} order={order} gridColumn="span 1" gridRow={`span ${ROWS[variant]}`} borderRadius={isMini ? '22px' : '26px'} bg={tint.l} _dark={{ bg: tint.d }}>
      <SafeImage src={p.image} alt={p.name} tint={tint} />
      <Hit label={`Quick view ${p.name}`} onClick={() => actions.onOpen(p)} />

      <Box position="absolute" top="8px" left="8px" zIndex={2} pointerEvents="none">{chipEl}</Box>
      <Box position="absolute" top="6px" right="6px" zIndex={3}>
        <WishButton liked={liked} onToggle={(e) => actions.onLike(p.id, e)} label={`Wishlist ${p.name}`} size={isMini ? 32 : 36} />
      </Box>

      {isMini ? (
        <Flex position="absolute" left="6px" right="6px" bottom="6px" justify="space-between" align="center" zIndex={2} pointerEvents="none">
          <Box borderRadius="full" px="10px" py="4px" fontSize="12px" fontWeight={700} {...surface}>{fmt(p.price)}</Box>
          <Box pointerEvents="auto" position="relative" zIndex={3}>
            <AddButton added={added} onAdd={() => actions.onAdd(p.id)} size={32} label={`Add ${p.name} to cart`} />
          </Box>
        </Flex>
      ) : (
        <Box position="absolute" left="6px" right="6px" bottom="6px" zIndex={2} borderRadius="20px" p="10px" pointerEvents="none" {...surface}>
          {variant === 'tall' && <Rating p={p} />}
          <Text fontWeight={700} fontSize="13px" noOfLines={1} letterSpacing="-0.01em" mt={variant === 'tall' ? '2px' : 0}>{p.name}</Text>
          <Flex justify="space-between" align="center" mt="4px">
            <Box>
              <Text fontWeight={700} fontSize="15px" lineHeight={1.1}>{fmt(p.price)}</Text>
              <Text fontSize="11px" textDecoration="line-through" {...mutedText}>{fmt(p.compareAt)}</Text>
            </Box>
            <Box pointerEvents="auto" position="relative" zIndex={3}>
              <AddButton added={added} onAdd={() => actions.onAdd(p.id)} label={`Add ${p.name} to cart`} />
            </Box>
          </Flex>
        </Box>
      )}
    </Tile>
  );
};

/* ---------- API-driven category tile (existing data flow) ---------- */
const CategoryTile = ({
  cat, images, index, span, liked, onLike, reduced,
}: { cat: any; images: string[]; index: number; span: number; liked: boolean; onLike: (e: React.MouseEvent) => void; reduced: boolean }) => {
  const name: string = cat.name || 'Category';
  const colorScheme = getCategoryColor(name);
  const CatIcon = getCategoryIcon(name);
  const productCount = cat.productCount || cat.products?.length || 0;
  const discount = productCount > 10 ? `${stableDiscount(String(cat._id))}% off` : '';
  const tint = TINTS[(index + 1) % TINTS.length];
  return (
    <Tile
      i={index}
      gridColumn={`span ${span}`}
      borderRadius="26px"
      h={{ base: '190px', md: '240px' }}
      bg={tint.l}
      _dark={{ bg: tint.d }}
    >
      {images.map((src, i) => (
        <SafeImage key={`${src}-${i}`} src={src} alt={i === 0 ? name : ''} tint={tint} icon={CatIcon} opacity={i === (cat.__idx || 0) ? 1 : 0} transition={reduced ? undefined : 'opacity .8s ease'} />
      ))}
      <Box position="absolute" inset={0} bgGradient="linear(to-b, rgba(0,0,0,0) 35%, rgba(10,12,30,.78) 100%)" pointerEvents="none" />
      <Badge position="absolute" top="10px" left="10px" colorScheme={colorScheme} variant="solid" borderRadius="full" px="8px" py="3px" fontSize="10px" textTransform="none" zIndex={2}>
        <HStack spacing="4px"><Icon as={CatIcon} boxSize="10px" /><Text>{cat.isFeatured ? 'Featured' : 'Trending'}</Text></HStack>
      </Badge>
      <Box position="absolute" top="6px" right="6px" zIndex={3}>
        <WishButton liked={liked} onToggle={onLike} label={`Wishlist ${name}`} size={34} />
      </Box>
      <VStack position="absolute" left={0} right={0} bottom={0} p="12px" align="flex-start" spacing="4px" color="white" zIndex={2}>
        <Heading as="h3" fontSize={{ base: '18px', md: '22px' }} fontWeight={700} letterSpacing="-0.02em" noOfLines={1} w="100%">{name}</Heading>
        <Text fontSize="12px" opacity={0.9}>{productCount > 0 ? `${productCount}+ products` : 'Explore collection'}{discount ? ` · ${discount}` : ''}</Text>
        <Button size="sm" h="32px" variant="outline" color="white" borderColor="whiteAlpha.700" borderRadius="full" rightIcon={<FiArrowRight />} _hover={{ bg: 'white', color: C.ink }} _active={{ transform: 'scale(.96)' }}>
          Shop now
        </Button>
      </VStack>
    </Tile>
  );
};

/* ============================================================
   Drawers
   ============================================================ */
const QuickView = ({
  product, isOpen, onClose, liked, onLike, added, onAdd,
}: { product: Product | null; isOpen: boolean; onClose: () => void; liked: boolean; onLike: (e: React.MouseEvent) => void; added: boolean; onAdd: (qty: number) => void }) => {
  const placement = (useBreakpointValue({ base: 'bottom', md: 'right' }) ?? 'bottom') as 'bottom' | 'right';
  const [qty, setQty] = useState(1);
  useEffect(() => { setQty(1); }, [product?.id]);
  if (!product) return null;
  const tint = TINTS[Math.abs(product.id.length) % TINTS.length];
  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement={placement} size={placement === 'right' ? 'md' : 'full'}>
      <DrawerOverlay bg="blackAlpha.600" />
      <DrawerContent borderTopRadius={{ base: '28px', md: 0 }} borderLeftRadius={{ md: '28px' }} maxH={{ base: '92dvh', md: '100dvh' }} h={{ base: 'auto', md: '100dvh' }} mt="auto" {...surface}>
        <DrawerCloseButton zIndex={5} top="12px" right="12px" bg="whiteAlpha.900" color={C.ink} borderRadius="full" />
        <DrawerBody p={0} pb="env(safe-area-inset-bottom)">
          <Box position="relative" role="group" h={{ base: '270px', md: '380px' }}>
            <SafeImage src={product.image} alt={product.name} tint={tint} />
            <HStack position="absolute" left="14px" bottom="12px" spacing={2} zIndex={2}>
              <Badge bg={C.citron} color={C.ink} borderRadius="full" px="10px" py="3px" textTransform="none">{product.category}</Badge>
              <Badge bg={C.coral} color="white" borderRadius="full" px="10px" py="3px" textTransform="none">-{pct(product)}%</Badge>
            </HStack>
          </Box>
          <Box p="18px">
            <Flex justify="space-between" align="flex-start" gap={3}>
              <Box minW={0}>
                <Heading as="h3" fontSize="24px" fontWeight={700} letterSpacing="-0.03em" lineHeight={1.1}>{product.name}</Heading>
                <Box mt="6px"><Rating p={product} /></Box>
              </Box>
              <Box textAlign="right" flexShrink={0}>
                <Text fontSize="24px" fontWeight={900} letterSpacing="-0.03em" lineHeight={1}>{fmt(product.price)}</Text>
                <Text fontSize="12px" textDecoration="line-through" {...mutedText}>{fmt(product.compareAt)}</Text>
              </Box>
            </Flex>
            <Text mt="12px" fontSize="14px" lineHeight={1.5} {...mutedText}>{product.blurb}</Text>
            <HStack mt="12px" spacing={2} fontSize="12px" {...mutedText}>
              <Icon as={FiTruck} /><Text>Free delivery on orders over {fmt(999)}</Text>
            </HStack>
            <HStack mt="18px" spacing={3}>
              <Qty value={qty} onChange={(n) => setQty(Math.min(10, Math.max(1, n)))} />
              <Button
                flex={1}
                h="52px"
                borderRadius="full"
                fontWeight={700}
                bg={added ? '#1F9D63' : C.ink}
                color={added ? 'white' : 'white'}
                _dark={{ bg: added ? '#1F9D63' : C.citron, color: added ? 'white' : C.ink }}
                _hover={{}}
                _active={{ transform: 'scale(.97)' }}
                leftIcon={<Icon as={added ? FiCheck : FiShoppingBag} />}
                onClick={() => onAdd(qty)}
              >
                {added ? 'Added to cart' : `Add · ${fmt(product.price * qty)}`}
              </Button>
              <IconButton
                aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={liked}
                onClick={onLike}
                h="52px"
                w="52px"
                isRound
                variant="outline"
                color={liked ? C.coral : undefined}
                icon={<Icon as={liked ? FaHeart : FaRegHeart} />}
              />
            </HStack>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const CartDrawer = ({
  isOpen, onClose, lines, onQty, onCheckout,
}: { isOpen: boolean; onClose: () => void; lines: { p: Product; qty: number }[]; onQty: (id: string, qty: number) => void; onCheckout: () => void }) => {
  const placement = (useBreakpointValue({ base: 'bottom', md: 'right' }) ?? 'bottom') as 'bottom' | 'right';
  const total = lines.reduce((a, l) => a + l.p.price * l.qty, 0);
  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement={placement} size={placement === 'right' ? 'md' : 'full'}>
      <DrawerOverlay bg="blackAlpha.600" />
      <DrawerContent borderTopRadius={{ base: '28px', md: 0 }} borderLeftRadius={{ md: '28px' }} maxH={{ base: '88dvh', md: '100dvh' }} h={{ base: 'auto', md: '100dvh' }} mt="auto" {...surface}>
        <DrawerCloseButton top="14px" right="14px" borderRadius="full" />
        <Box px="18px" pt="18px" pb="8px">
          <Heading as="h3" fontSize="22px" fontWeight={700} letterSpacing="-0.03em">Your cart</Heading>
        </Box>
        <DrawerBody px="18px" pb="calc(16px + env(safe-area-inset-bottom))">
          {lines.length === 0 ? (
            <Flex direction="column" align="center" py="40px" gap={3} textAlign="center">
              <Icon as={FiShoppingBag} boxSize={9} color={C.ultra} />
              <Text fontWeight={700}>Nothing here yet</Text>
              <Text fontSize="13px" {...mutedText}>Add something you like and it will show up here.</Text>
              <Button onClick={onClose} borderRadius="full" bg={C.ink} color="white" _hover={{ bg: C.ultra }}>Browse picks</Button>
            </Flex>
          ) : (
            <>
              {lines.map(({ p, qty }, i) => (
                <Flex key={p.id} gap={3} py="10px" align="center" borderBottomWidth="1px" borderColor="blackAlpha.100" _dark={{ borderColor: 'whiteAlpha.200' }}>
                  <Box position="relative" w="64px" h="64px" borderRadius="16px" overflow="hidden" flexShrink={0}>
                    <SafeImage src={p.image} alt={p.name} tint={TINTS[i % TINTS.length]} />
                  </Box>
                  <Box flex={1} minW={0}>
                    <Text fontWeight={700} fontSize="14px" noOfLines={1}>{p.name}</Text>
                    <Text fontSize="13px" fontWeight={700} color={C.ultra} _dark={{ color: C.citron }}>{fmt(p.price * qty)}</Text>
                  </Box>
                  <Qty value={qty} onChange={(n) => onQty(p.id, n)} />
                </Flex>
              ))}
              <Flex justify="space-between" align="baseline" mt="16px">
                <Text fontSize="14px" {...mutedText}>Subtotal</Text>
                <Text fontSize="22px" fontWeight={900} letterSpacing="-0.03em">{fmt(total)}</Text>
              </Flex>
              <Button mt="12px" w="100%" h="52px" borderRadius="full" fontWeight={700} bg={C.ink} color="white" _dark={{ bg: C.citron, color: C.ink }} _hover={{}} _active={{ transform: 'scale(.98)' }} rightIcon={<FiArrowRight />} onClick={onCheckout}>
                Checkout
              </Button>
            </>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

/* ============================================================
   Main component
   ============================================================ */
const BentoGridSection = observer(() => {
  const toast = useToast();
  const { anim, reduced } = useMotion();

  // existing data state
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [categoryImages, setCategoryImages] = useState<Map<string, string[]>>(new Map());
  const [imageIndices, setImageIndices] = useState<Map<string, number>>(new Map());
  const intervalRefs = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  // new storefront state
  const [filter, setFilter] = useState<Filter>('All');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [qv, setQv] = useState<Product | null>(null);
  const [qvOpen, setQvOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
 const addTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const bg = useColorModeValue(C.mist, C.night);
  const skStart = useColorModeValue('#E3E0FF', '#25225C');
  const skEnd = useColorModeValue('#F3F2FF', '#34308A');

  const ALL_PRODUCTS = useMemo(() => [HERO, ...PRODUCTS], []);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartLines = useMemo(
    () => Object.entries(cart).map(([id, qty]) => ({ p: ALL_PRODUCTS.find((x) => x.id === id)!, qty })).filter((l) => l.p),
    [cart, ALL_PRODUCTS]
  );

  // 1. Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryStore.getAllCategories({});
        if (res?.status === 'success' && Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          throw new Error('Invalid categories response');
        }
      } catch (err) {
        console.error(err);
        toast({ title: 'Error', description: 'Failed to load categories', status: 'error', duration: 3000 });
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [toast]);

  // 2. Fetch product images for each category
  useEffect(() => {
    if (categories.length === 0) return;
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        categories.map(async (cat): Promise<[string, string[]]> => {
          try {
            const payload = { category: cat._id, limit: 8 };
            const res = await shopStore.getAllProducts(payload, true);
            let products: any[] = [];
            if (res?.status === 'success') {
              if (Array.isArray(res.data)) products = res.data;
              else if (res.data?.products) products = res.data.products;
            } else if (Array.isArray(res?.data)) products = res.data;
            else if (Array.isArray(res)) products = res;
            const images = products.map((p) => p.image || p.images?.[0]).filter(Boolean) as string[];
            if (images.length === 0) images.push(cat.image || FALLBACK_IMAGE);
            return [cat._id, images.slice(0, 5)];
          } catch (err) {
            console.warn(`Failed to fetch images for ${cat.name}`, err);
            return [cat._id, [cat.image || FALLBACK_IMAGE]];
          }
        })
      );
      if (cancelled) return;
      setCategoryImages(new Map<string, string[]>(entries));
      setImageIndices(new Map<string, number>(categories.map((c) => [c._id, 0] as [string, number])));
    })();
    return () => { cancelled = true; };
  }, [categories]);

  // 3. Auto-rotate category images (every 3s, off for reduced motion)
  useEffect(() => {
    if (categoryImages.size === 0 || reduced) return;
    intervalRefs.current.forEach(clearInterval);
    intervalRefs.current.clear();
    Array.from(categoryImages.entries()).forEach(([catId, images]) => {
      if (images.length <= 1) return;
      const interval = setInterval(() => {
        setImageIndices((prev) => new Map(prev).set(catId, ((prev.get(catId) || 0) + 1) % images.length));
      }, 3000);
      intervalRefs.current.set(catId, interval);
    });
    return () => {
      intervalRefs.current.forEach(clearInterval);
      intervalRefs.current.clear();
    };
  }, [categoryImages, reduced]);

  useEffect(() => () => { if (addTimer.current) clearTimeout(addTimer.current); }, []);

  const toggleLike = useCallback((id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const addToCart = useCallback((id: string, qty = 1) => {
    setCart((c) => ({ ...c, [id]: Math.min(10, (c[id] || 0) + qty) }));
    setJustAdded(id);
    if (addTimer.current) clearTimeout(addTimer.current);
    addTimer.current = setTimeout(() => setJustAdded(null), 1100);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = Math.min(10, qty);
      return next;
    });
  }, []);

  const openQV = useCallback((p: Product) => { setQv(p); setQvOpen(true); }, []);

  const shopDeals = () => {
    setFilter('Gadgets');
    requestAnimationFrame(() => gridRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }));
  };

  const actions: TileActions = {
    liked: (id) => likedItems.has(id),
    onLike: toggleLike,
    onAdd: addToCart,
    isAdded: (id) => justAdded === id,
    onOpen: openQV,
  };

  const visible = useMemo(() => PRODUCTS.filter((p) => filter === 'All' || p.category === filter), [filter]);
  const variants = useMemo(() => assignVariants(visible.length), [visible.length]);
  const justIn = useMemo(() => PRODUCTS.filter((p) => p.isNew).slice(0, 3), []);
  const justInOrder = 10 + Math.min(3, visible.length) * 2 - 1;

  const catCount = Math.min(categories.length, 7);
  const catSpan = (i: number) => (i === 0 || (i === catCount - 1 && (catCount - 1) % 2 === 1) ? 2 : 1);

  return (
    <Box bg={bg} color={C.ink} _dark={{ color: '#F2F3FF' }} position="relative" overflowX="clip" py={{ base: 3, md: 12 }}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb="10px" gap={3}>
          <Box minW={0}>
            <Heading as="h2" fontSize={{ base: '26px', md: '40px' }} fontWeight={700} letterSpacing="-0.04em" lineHeight={1.05}>
              Fresh picks
            </Heading>
            <Text fontSize={{ base: '13px', md: '15px' }} {...mutedText} noOfLines={1}>
              Handpicked tech, fashion and home finds
            </Text>
          </Box>
          <HStack spacing={2} flexShrink={0}>
            <Flex align="center" gap="5px" h="42px" px="12px" borderRadius="full" aria-label={`${likedItems.size} in wishlist`} {...surface}>
              <Icon as={FaHeart} color={C.coral} boxSize="14px" />
              <Text fontSize="13px" fontWeight={700}>{likedItems.size}</Text>
            </Flex>
            <Box position="relative">
              <IconButton
                aria-label={`Open cart, ${cartCount} items`}
                onClick={() => setCartOpen(true)}
                isRound
                h="42px"
                w="42px"
                bg={C.ink}
                color="white"
                _dark={{ bg: C.citron, color: C.ink }}
                _hover={{}}
                _active={{ transform: 'scale(.92)' }}
                icon={<FiShoppingBag size={18} />}
              />
              {cartCount > 0 && (
                <Flex
                  key={cartCount}
                  position="absolute"
                  top="-4px"
                  right="-4px"
                  minW="20px"
                  h="20px"
                  px="5px"
                  align="center"
                  justify="center"
                  borderRadius="full"
                  bg={C.coral}
                  color="white"
                  fontSize="11px"
                  fontWeight={700}
                  borderWidth="2px"
                  borderColor={bg}
                  animation={anim(`${pop} .4s ease`)}
                >
                  {cartCount}
                </Flex>
              )}
            </Box>
          </HStack>
        </Flex>

        {/* Filters */}
        <Flex wrap="wrap" gap="6px" mb="10px" role="group" display={{base:"none",md:"flex"}} aria-label="Filter products by category">
          {FILTERS.map((f) => {
            const active = f === filter;
            return (
              <Button
                key={f}
                size="sm"
                h="34px"
                px="14px"
                borderRadius="full"
                fontWeight={700}
                fontSize="13px"
                aria-pressed={active}
                onClick={() => setFilter(f)}
                bg={active ? C.ink : 'white'}
                color={active ? 'white' : C.ink}
                borderWidth="1px"
                borderColor={active ? C.ink : 'blackAlpha.100'}
                _dark={{ bg: active ? C.citron : '#171A33', color: active ? C.ink : '#F2F3FF', borderColor: active ? C.citron : 'whiteAlpha.200' }}
                _hover={{}}
                _active={{ transform: 'scale(.95)' }}
                transition="background .2s, color .2s, transform .15s"
              >
                {f}
              </Button>
            );
          })}
        </Flex>
        <VisuallyHidden aria-live="polite">{`Showing ${visible.length} products`}</VisuallyHidden>

        {/* Bento grid */}
        <Box
          ref={gridRef}
          display="grid"
          gridTemplateColumns={{ base: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' }}
          gridAutoRows={{ base: '10px', md: '12px' }}
          gridAutoFlow="row dense"
          gap={{ base: '10px', md: '12px' }}
          scrollMarginTop="12px"
        >
          <HeroCard p={HERO} actions={actions} />
          <PromoCard onShop={shopDeals} />
          <JustInCard items={justIn} orderBase={justInOrder} onOpen={openQV} onAll={() => setFilter('All')} />
          {visible.map((p, i) => (
            <ProductTile key={`${filter}-${p.id}`} p={p} variant={variants[i]} i={i} order={10 + i * 2} actions={actions} />
          ))}
        </Box>

        {/* Categories from the store API */}
        {(loading || catCount > 0) && (
          <Box mt={{ base: 6, md: 10 }}>
            <Flex justify="space-between" align="baseline" mb="10px">
              <Heading as="h2" fontSize={{ base: '20px', md: '28px' }} fontWeight={700} letterSpacing="-0.03em">Shop by category</Heading>
              {!loading && <Text fontSize="12px" {...mutedText}>{catCount} collections</Text>}
            </Flex>
            {loading ? (
              <Box display="grid" gridTemplateColumns={{ base: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' }} gap={{ base: '10px', md: '12px' }}>
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} h={{ base: '190px', md: '240px' }} borderRadius="26px" startColor={skStart} endColor={skEnd} gridColumn={i === 0 ? 'span 2' : 'span 1'} />
                ))}
              </Box>
            ) : (
              <Box display="grid" gridTemplateColumns={{ base: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' }} gap={{ base: '10px', md: '12px' }}>
                {categories.slice(0, 7).map((cat, idx) => {
                  const images = categoryImages.get(cat._id) || [cat.image || FALLBACK_IMAGE];
                  return (
                    <CategoryTile
                      key={cat._id}
                      cat={{ ...cat, __idx: imageIndices.get(cat._id) || 0 }}
                      images={images}
                      index={idx}
                      span={catSpan(idx)}
                      liked={likedItems.has(cat._id)}
                      onLike={(e) => toggleLike(cat._id, e)}
                      reduced={reduced}
                    />
                  );
                })}
              </Box>
            )}
          </Box>
        )}

      <QuickView
        product={qv}
        isOpen={qvOpen}
        onClose={() => setQvOpen(false)}
        liked={qv ? likedItems.has(qv.id) : false}
        onLike={(e) => qv && toggleLike(qv.id, e)}
        added={qv ? justAdded === qv.id : false}
        onAdd={(qty) => qv && addToCart(qv.id, qty)}
      />
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        lines={cartLines}
        onQty={setQty}
        onCheckout={() => toast({ title: 'Checkout is not connected yet', status: 'info', duration: 2500 })}
      />
    </Box>
  );
});

export default BentoGridSection;