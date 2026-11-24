import React from 'react';
import {
  FiSmartphone,
  FiTv,
  FiShoppingBag,
  FiPackage,
  FiHeart,
  FiHome,
  FiTruck,
  FiBook,
  FiSmile,
  FiCoffee,
  FiActivity,
  FiHeadphones,
  FiWatch,
  FiCamera,
  FiTool,
  FiScissors,
  FiCpu,
  FiZap,
  FiLayers,
  FiFeather,
  FiCompass,
  FiAward,
} from 'react-icons/fi';
import {
  HiOutlineSparkles,
  HiOutlineDeviceMobile,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlineTruck,
  HiOutlineBookOpen,
  HiOutlineDesktopComputer,
  HiOutlineScissors,
  HiOutlineCake,
  HiOutlineLightBulb,
  HiOutlineColorSwatch,
} from 'react-icons/hi';
import {
  IoShirtOutline,
  IoHardwareChipOutline,
  IoFastFoodOutline,
  IoFitnessOutline,
  IoGameControllerOutline,
  IoCarSportOutline,
  IoConstructOutline,
  IoMusicalNotesOutline,
  IoPawOutline,
  IoMedkitOutline,
  IoColorPaletteOutline,
} from 'react-icons/io5';

export const getCategoryIcon = (
  name: string,
  size: number = 18,
  color: string = '#475569',
  strokeWidth: number = 2
) => {
  const lower = (name || '').toLowerCase();

  // 1. Electronics & Gadgets
  if (['mobile', 'smartphone', 'phone', 'cell'].some(k => lower.includes(k)))
    return <FiSmartphone size={size} color={color} strokeWidth={strokeWidth} />;

  if (['electronics & gadgets', 'gadget', 'gadgets'].some(k => lower.includes(k)))
    return <IoHardwareChipOutline size={size} color={color} strokeWidth={strokeWidth} />;

  if (['processor', 'cpu', 'chip'].some(k => lower.includes(k)))
    return <FiCpu size={size} color={color} strokeWidth={strokeWidth} />;

  if (['electronics', 'electronic', 'electrical', 'breaker', 'extension', 'multimeter'].some(k => lower.includes(k)))
    return <FiZap size={size} color={color} strokeWidth={strokeWidth} />;

  if (['computer', 'laptop', 'desktop', 'screen'].some(k => lower.includes(k)))
    return <HiOutlineDesktopComputer size={size} color={color} strokeWidth={strokeWidth} />;

  if (['audio', 'headphone', 'earphone', 'speaker'].some(k => lower.includes(k)))
    return <FiHeadphones size={size} color={color} strokeWidth={strokeWidth} />;

  if (['watch', 'smartwatch'].some(k => lower.includes(k)))
    return <FiWatch size={size} color={color} strokeWidth={strokeWidth} />;

  if (['camera', 'photo', 'dslr'].some(k => lower.includes(k)))
    return <FiCamera size={size} color={color} strokeWidth={strokeWidth} />;

  // 2. Clothing & Fashion
  if (['footwear', 'shoe', 'shoes', 'sneaker', 'boots'].some(k => lower.includes(k)))
    return <IoShirtOutline size={size} color={color} strokeWidth={strokeWidth} />;

  if (['clothing', 'fashion & apparel', 'fashion', 'apparel', 'clothes', 'dress', 'shirt', 't-shirt'].some(k => lower.includes(k)))
    return <IoShirtOutline size={size} color={color} strokeWidth={strokeWidth} />;

  if (['jewelry', 'accessory', 'accessories'].some(k => lower.includes(k)))
    return <HiOutlineSparkles size={size} color={color} strokeWidth={strokeWidth} />;

  // 3. Grocery & Food
  if (['grocery & gourmet food', 'grocery', 'gourmet', 'food', 'fruit', 'vegetable', 'snack', 'grain'].some(k => lower.includes(k)))
    return <IoFastFoodOutline size={size} color={color} strokeWidth={strokeWidth} />;

  if (['coffee', 'tea', 'beverage', 'drink'].some(k => lower.includes(k)))
    return <FiCoffee size={size} color={color} strokeWidth={strokeWidth} />;

  // 4. Beauty & Personal Care
  if (['beauty & personal care', 'beauty', 'skincare', 'cosmetic', 'makeup', 'care', 'hair'].some(k => lower.includes(k)))
    return <HiOutlineScissors size={size} color={color} strokeWidth={strokeWidth} />;

  // 5. Health & Fitness
  if (['health, wellness & fitness', 'health', 'wellness', 'fitness', 'gym', 'workout', 'diet'].some(k => lower.includes(k)))
    return <IoFitnessOutline size={size} color={color} strokeWidth={strokeWidth} />;

  if (['medicine', 'pharma', 'medical', 'clinic', 'first aid'].some(k => lower.includes(k)))
    return <IoMedkitOutline size={size} color={color} strokeWidth={strokeWidth} />;

  // 6. Home & Living
  if (['home, kitchen & living', 'home', 'living', 'furniture', 'kitchen', 'appliance', 'decor'].some(k => lower.includes(k)))
    return <HiOutlineHome size={size} color={color} strokeWidth={strokeWidth} />;

  // 7. Automotive & Motorbike
  if (['automotive & motorbike', 'automotive', 'motorbike', 'car', 'bike', 'vehicle', 'auto'].some(k => lower.includes(k)))
    return <IoCarSportOutline size={size} color={color} strokeWidth={strokeWidth} />;

  // 8. Books & Stationery
  if (['book', 'books', 'stationery', 'education', 'school', 'office'].some(k => lower.includes(k)))
    return <HiOutlineBookOpen size={size} color={color} strokeWidth={strokeWidth} />;

  // 9. Toys & Games
  if (['toy', 'toys', 'game', 'games', 'baby', 'kids', 'puzzle'].some(k => lower.includes(k)))
    return <IoGameControllerOutline size={size} color={color} strokeWidth={strokeWidth} />;

  // 10. Industrial, Tools & Safety
  if (['industrial', 'safety', 'tools', 'tool', 'hardware', 'construction', 'repair', 'wrench'].some(k => lower.includes(k)))
    return <IoConstructOutline size={size} color={color} strokeWidth={strokeWidth} />;

  // 11. Pets
  if (['pet', 'dog', 'cat', 'animal'].some(k => lower.includes(k)))
    return <IoPawOutline size={size} color={color} strokeWidth={strokeWidth} />;

  // 12. Music & Entertainment
  if (['music', 'song', 'audio', 'instrument'].some(k => lower.includes(k)))
    return <IoMusicalNotesOutline size={size} color={color} strokeWidth={strokeWidth} />;

  // Fallback Modern Clean Icons
  const fallbacks = [
    <HiOutlineShoppingBag size={size} color={color} strokeWidth={strokeWidth} />,
    <FiShoppingBag size={size} color={color} strokeWidth={strokeWidth} />,
    <FiPackage size={size} color={color} strokeWidth={strokeWidth} />,
    <HiOutlineSparkles size={size} color={color} strokeWidth={strokeWidth} />,
    <FiLayers size={size} color={color} strokeWidth={strokeWidth} />,
  ];

  let hash = 0;
  for (let i = 0; i < lower.length; i++) {
    hash = lower.charCodeAt(i) + ((hash << 5) - hash);
  }

  return fallbacks[Math.abs(hash) % fallbacks.length];
};
