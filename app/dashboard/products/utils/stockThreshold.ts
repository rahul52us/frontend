"use client";

export const DEFAULT_LOW_STOCK_THRESHOLD = 5;

const parsePositiveNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const getLowStockThreshold = (product: any) =>
  parsePositiveNumber(product?.lowStockThreshold) ||
  parsePositiveNumber(product?.threshold) ||
  parsePositiveNumber(product?.reorderLevel) ||
  parsePositiveNumber(product?.minStock) ||
  DEFAULT_LOW_STOCK_THRESHOLD;

export const isLowStockProduct = (product: any) => {
  const stock = Number(product?.stock || 0);
  return stock > 0 && stock <= getLowStockThreshold(product);
};
