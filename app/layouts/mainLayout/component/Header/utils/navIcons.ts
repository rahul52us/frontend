import {
  FiHome,
  FiInfo,
  FiShoppingBag,
  FiGrid,
  FiMonitor,
  FiGlobe,
  FiSmartphone,
  FiShoppingCart,
} from "react-icons/fi";
import { IconType } from "react-icons";

export const navIcons: Record<string, IconType> = {
  Home: FiHome,
  About: FiInfo,
  Shops: FiShoppingBag,
  "Local Shops": FiShoppingCart,
  "Online Shops": FiGlobe,
  Categories: FiGrid,
  Electronics: FiMonitor,
  Clothing: FiSmartphone,
};
