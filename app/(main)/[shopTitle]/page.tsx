"use client";
import {
  Box,
  Center,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import ShopPage from "./component/ShopPage/ShopPage";
import { useParams } from "next/navigation";
import stores from "../../store/stores";
import ShopLayoutSkeletan from "./component/ShopPage/ShopLayoutSkeletan";

const dummyData = {
  _id: "shop123",
  name: "Artisan Crafts & Co.",
  description:
    "Premium handcrafted goods made with sustainable materials and traditional techniques. Premium handcrafted goods made with sustainable materials and traditional techniques. Premium handcrafted goods made with sustainable materials and traditional techniques. Premium handcrafted goods made with sustainable materials and traditional techniques.",
  about:
    "Founded in 2015, Artisan Crafts & Co. brings together skilled artisans from around the world. We believe in preserving traditional craftsmanship while embracing modern design sensibilities. Each product tells a story and supports local communities.",
  categories: ["Home Decor", "Furniture", "Textiles", "Ceramics"],
  tags: ["handmade", "sustainable", "eco-friendly", "fair-trade", "artisanal"],
  images: {
    logo: "https://images.unsplash.com/photo-1557053964-937650b63311?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxvZ298ZW58MHx8MHx8fDA%3D/placeholder.svg?height=200&width=200",
    cover:
      "https://images.unsplash.com/photo-1572611932849-7f0f116fb2f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    gallery: [
      "https://images.unsplash.com/photo-1526745925052-dd824d27b9ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1526745925052-dd824d27b9ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1526745925052-dd824d27b9ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1526745925052-dd824d27b9ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
  },
  ratings: {
    average: 4.8,
    total: 256,
  },
  location: {
    address: "123 Craft Avenue",
    city: "Portland",
    state: "Oregon",
    postalCode: "97201",
    country: "USA",
    coordinates: {
      latitude: 45.523064,
      longitude: -122.676483,
    },
    additionalLocations: [
      {
        address: "456 Artisan Street",
        city: "Seattle",
        state: "Washington",
        postalCode: "98101",
        country: "USA",
        coordinates: {
          latitude: 47.606209,
          longitude: -122.332071,
        },
      },
    ],
  },
  contact: {
    phone: "+1 (503) 555-1234",
    email: "hello@artisancrafts.co",
    website: "https://artisancrafts.co",
    socialMedia: {
      instagram: "artisancraftsco",
      facebook: "ArtisanCraftsCo",
      twitter: "ArtisanCraftsCo",
    },
  },
  operatingHours: [
    { day: "Monday", open: "10:00", close: "18:00" },
    { day: "Tuesday", open: "10:00", close: "18:00" },
    { day: "Wednesday", open: "10:00", close: "18:00" },
    { day: "Thursday", open: "10:00", close: "20:00" },
    { day: "Friday", open: "10:00", close: "20:00" },
    { day: "Saturday", open: "11:00", close: "13:00" },
    { day: "Sunday", open: "12:00", close: "16:00" },
  ],
  status: "active",
};

const Page = observer(() => {
  const [loading, setLoading] = useState(true);
  const [shopData, setShopData] = useState(null);
  const [error, setError] = useState(null);

  const { shopTitle } = useParams();
  const {
    shopStore: { getSingleShop },
  } = stores;

  useEffect(() => {
    if (!shopTitle) return;

    const fetchShopData = async () => {
      setLoading(true);
      setError(null); // Reset error before fetching

      try {
        const formattedTitle = Array.isArray(shopTitle)
          ? shopTitle.join(" ")
          : shopTitle.replace(/-/g, " ");

        const data = await getSingleShop({ title: formattedTitle });

        if (!data?.data) {
          setError("Shop not found");
        } else {
          setShopData(data?.data);
        }
      } catch ({}) {
        setError("Failed to fetch shop data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [shopTitle, getSingleShop]);

  if (loading) {
    return (
      <ShopLayoutSkeletan />
    );
  }


  if (error) {
    return (
      <Center minH="80vh">
        <Text fontSize="lg" color="red.500">
          {error}
        </Text>
      </Center>
    );
  }

  return (
    <Box>
      {shopData ? (
        <ShopPage
          shopData={{
            ...shopData,
            gallery: shopData.gallery,
            ratings: dummyData.ratings,
          }}
        />
      ) : (
        <Text>No shop data available.</Text>
      )}
    </Box>
  );
});

export default Page;
