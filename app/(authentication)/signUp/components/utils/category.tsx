
import {
  // Food
  FaAppleAlt,
  FaBaby,
  FaBatteryHalf,
  FaBicycle,
  FaBolt,
  // Books & Media
  FaBookOpen,
  FaBoxOpen,
  FaCamera,
  FaCampground,
  // Automotive
  FaCar,
  // Pets
  FaCat,
  FaCoffee,
  // Home
  FaCouch,
  FaDesktop,
  FaDog,
  // Sports
  FaDumbbell,
  FaFilm,
  FaGamepad,
  FaGem,
  FaGlasses,
  // Tools
  FaHammer,
  FaHdd,
  FaHeadphones,
  FaHeartbeat,
  // Default
  FaLayerGroup,
  FaLightbulb,
  FaMagic,
  // Electronics
  FaMicrochip,
  FaMobileAlt,
  FaMusic,
  FaPenNib,
  // Health
  FaPills,
  // Office
  FaPrint,
  // Toys
  FaPuzzlePiece,
  // Garden
  FaSeedling,
  FaShoePrints,
  FaShoppingBag,
  FaSnowflake,
  FaSoap,
  FaTag,
  FaTools,
  FaTree,
  // Clothing
  FaTshirt,
  FaUtensils,
  FaWatchmanMonitoring,
  FaWifi,
  FaWrench
} from "react-icons/fa";


export const getCategoryIcon = (
name: string, size: number, color: string, p0?: number) => {
  const lower = name.toLowerCase();

  // Electronics
  if (['electronics', 'electronic', 'gadget', 'gadgets'].some(k => lower.includes(k)))
    return <FaBolt size={size} color={color} />;

  if (['processor', 'cpu', 'chip'].some(k => lower.includes(k)))
    return <FaMicrochip size={size} color={color} />;

  if (['graphics card', 'gpu', 'video card', 'vga'].some(k => lower.includes(k)))
    return <FaDesktop size={size} color={color} />;

  if (['mobile', 'phone', 'smartphone', 'cell'].some(k => lower.includes(k)))
    return <FaMobileAlt size={size} color={color} />;

  if (['storage', 'hard drive', 'ssd', 'hdd', 'disk'].some(k => lower.includes(k)))
    return <FaHdd size={size} color={color} />;

  if (['network', 'router', 'wifi', 'internet'].some(k => lower.includes(k)))
    return <FaWifi size={size} color={color} />;

  if (['battery', 'power bank', 'charger'].some(k => lower.includes(k)))
    return <FaBatteryHalf size={size} color={color} />;

  if (['headphone', 'earphone', 'earbud', 'audio'].some(k => lower.includes(k)))
    return <FaHeadphones size={size} color={color} />;

  if (['camera', 'lens', 'photography', 'dslr'].some(k => lower.includes(k)))
    return <FaCamera size={size} color={color} />;

  if (['watch', 'smartwatch', 'wearable'].some(k => lower.includes(k)))
    return <FaWatchmanMonitoring size={size} color={color} />;

  if (['gaming', 'console', 'playstation', 'xbox'].some(k => lower.includes(k)))
    return <FaGamepad size={size} color={color} />;

  // Clothing & Fashion
  if (['clothing', 'clothes', 'apparel', 'fashion', 'wear'].some(k => lower.includes(k)))
    return <FaTshirt size={size} color={color} />;

  if (['t-shirt', 'tshirt', 'tee'].some(k => lower.includes(k)))
    return <FaTshirt size={size} color={color} />;

  if (['shoe', 'shoes', 'footwear', 'sneaker', 'boot'].some(k => lower.includes(k)))
    return <FaShoePrints size={size} color={color} />;

  if (['glass', 'sunglass', 'eyewear', 'spectacle'].some(k => lower.includes(k)))
    return <FaGlasses size={size} color={color} />;

  if (['jewelry', 'jewel', 'accessory', 'accessories', 'ornament'].some(k => lower.includes(k)))
    return <FaGem size={size} color={color} />;

  // Home & Furniture
  if (['furniture', 'sofa', 'chair', 'table', 'bed'].some(k => lower.includes(k)))
    return <FaCouch size={size} color={color} />;

  if (['light', 'lamp', 'bulb', 'lighting'].some(k => lower.includes(k)))
    return <FaLightbulb size={size} color={color} />;

  if (['kitchen', 'cookware', 'utensil', 'appliance'].some(k => lower.includes(k)))
    return <FaUtensils size={size} color={color} />;

  if (['fridge', 'refrigerator', 'freezer'].some(k => lower.includes(k)))
    return <FaSnowflake size={size} color={color} />;

  if (['washing', 'washer', 'laundry'].some(k => lower.includes(k)))
    return <FaSoap size={size} color={color} />;

  // Sports & Outdoor
  if (['sport', 'fitness', 'gym', 'exercise'].some(k => lower.includes(k)))
    return <FaDumbbell size={size} color={color} />;

  if (['cycle', 'bicycle', 'bike'].some(k => lower.includes(k)))
    return <FaBicycle size={size} color={color} />;

  if (['camp', 'tent', 'outdoor', 'hiking'].some(k => lower.includes(k)))
    return <FaCampground size={size} color={color} />;

  // Health & Beauty
  if (['medicine', 'pharma', 'drug', 'pill'].some(k => lower.includes(k)))
    return <FaPills size={size} color={color} />;

  if (['health', 'wellness', 'beauty', 'care', 'skincare'].some(k => lower.includes(k)))
    return <FaHeartbeat size={size} color={color} />;

  // Automotive
  if (['car', 'auto', 'vehicle', 'automotive'].some(k => lower.includes(k)))
    return <FaCar size={size} color={color} />;

  if (['tool', 'wrench', 'repair', 'part'].some(k => lower.includes(k)))
    return <FaWrench size={size} color={color} />;

  // Books & Media
  if (['book', 'novel', 'literature', 'education'].some(k => lower.includes(k)))
    return <FaBookOpen size={size} color={color} />;

  if (['music', 'album', 'instrument'].some(k => lower.includes(k)))
    return <FaMusic size={size} color={color} />;

  if (['movie', 'film', 'video', 'dvd', 'bluray'].some(k => lower.includes(k)))
    return <FaFilm size={size} color={color} />;

  // Toys & Kids
  if (['toy', 'game', 'puzzle', 'board game'].some(k => lower.includes(k)))
    return <FaPuzzlePiece size={size} color={color} />;

  if (['baby', 'kid', 'child', 'maternity'].some(k => lower.includes(k)))
    return <FaBaby size={size} color={color} />;

  // Food & Grocery
  if (['food', 'grocery', 'fruit', 'vegetable', 'organic'].some(k => lower.includes(k)))
    return <FaAppleAlt size={size} color={color} />;

  if (['coffee', 'tea', 'beverage', 'drink'].some(k => lower.includes(k)))
    return <FaCoffee size={size} color={color} />;

  // Garden
  if (['garden', 'plant', 'flower', 'seed'].some(k => lower.includes(k)))
    return <FaSeedling size={size} color={color} />;

  if (['tree', 'lumber', 'wood'].some(k => lower.includes(k)))
    return <FaTree size={size} color={color} />;

  // Office
  if (['office', 'stationery', 'paper', 'supply'].some(k => lower.includes(k)))
    return <FaPrint size={size} color={color} />;

  if (['pen', 'pencil', 'art', 'craft', 'paint'].some(k => lower.includes(k)))
    return <FaPenNib size={size} color={color} />;

  // Pets
  if (['pet', 'cat', 'feline'].some(k => lower.includes(k)))
    return <FaCat size={size} color={color} />;

  if (['dog', 'puppy', 'canine'].some(k => lower.includes(k)))
    return <FaDog size={size} color={color} />;

  // Hardware & Tools
  if (['hammer', 'nail', 'construction'].some(k => lower.includes(k)))
    return <FaHammer size={size} color={color} />;

  if (['drill', 'power tool', 'machinery'].some(k => lower.includes(k)))
    return <FaTools size={size} color={color} />;

  // Generic fallbacks
  const firstChar = lower.charCodeAt(0) % 5;

  const fallbacks = [
    <FaBoxOpen size={size} color={color} />,
    <FaShoppingBag size={size} color={color} />,
    <FaMagic size={size} color={color} />,
    <FaTag size={size} color={color} />,
    <FaLayerGroup size={size} color={color} />,
  ];

  return fallbacks[firstChar];
};
