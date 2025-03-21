import { Product } from "./interface";

export const uniqueProducts: Product[] = Array.from(
    new Map(
      [
        {
          id: 1,
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60",
          category: "Business Supplies",
          name: "Premium Office Chair Office Chair",
          price: "299.99",
          rating: 4,
          freeShipping: true,
        },
        {
          id: 2,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60",
          category: "Electronics",
          name: "Wireless Headphones",
          price: "149.99",
          rating: 5,
          freeShipping: false,
        },
        {
          id: 3,
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60",
          category: "Fashion",
          name: "Running Shoes",
          price: "89.99",
          rating: 3,
          freeShipping: true,
        },
        {
          id: 4,
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60",
          category: "Business Supplies",
          name: "Ergonomic Desk",
          price: "399.99",
          rating: 4,
          freeShipping: true,
        },
        {
          id: 5,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60",
          category: "Electronics",
          name: "Bluetooth Speaker",
          price: "99.99",
          rating: 5,
          freeShipping: false,
        },
        {
          id: 6,
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60",
          category: "Fashion",
          name: "Sports Watch",
          price: "129.99",
          rating: 3,
          freeShipping: true,
        },
        {
          id: 7,
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60",
          category: "Business Supplies",
          name: "Ergonomic Desk",
          price: "399.99",
          rating: 4,
          freeShipping: true,
        },
        {
          id: 8,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60",
          category: "Electronics",
          name: "Bluetooth Speaker",
          price: "99.99",
          rating: 5,
          freeShipping: false,
        },
        {
          id: 9,
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60",
          category: "Fashion",
          name: "Sports Watch",
          price: "129.99",
          rating: 3,
          freeShipping: true,
        },
      ].map((product) => [product.id, product])
    ).values()
  );