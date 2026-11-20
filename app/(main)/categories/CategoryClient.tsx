"use client";

import {
  Box,
  Container,
  SimpleGrid,
  Text,
  Heading,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Image,
  Skeleton,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useSearchParams, useRouter } from "next/navigation";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import stores from "../../store/stores";
import categoryStore from "../../store/categoryStore/categoryStore";
import ProductCard from "../products/components/ProductCard/ProductCard";

const PLACEHOLDER_CATEGORY_IMAGE = "https://via.placeholder.com/300x200?text=Category";

// ─── Memoized Category Grid Card Item ──────────────────────────────────
const CategoryGridItem = memo(
  ({
    category,
    onClick,
  }: {
    category: any;
    onClick: (category: any) => void;
  }) => {
    const imageUrl = category?.image?.url || PLACEHOLDER_CATEGORY_IMAGE;

    return (
      <Box
        cursor="pointer"
        bg="var(--color-surface)"
        borderWidth="1px"
        borderColor="var(--color-border)"
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="sm"
        transition="all 0.3s ease"
        _hover={{
          transform: "translateY(-6px)",
          boxShadow: "lg",
          borderColor: "var(--color-primary)",
        }}
        onClick={() => onClick(category)}
        role="group"
      >
        <Box
          h={{ base: "140px", md: "180px" }}
          bg="var(--color-surface-hover)"
          overflow="hidden"
        >
          <Image
            src={imageUrl}
            alt={category.name}
            w="100%"
            h="100%"
            objectFit="cover"
            transition="transform 0.4s ease"
            _groupHover={{ transform: "scale(1.08)" }}
            loading="lazy"
            decoding="async"
          />
        </Box>
        <Box p={4} textAlign="center">
          <Text
            fontWeight="bold"
            fontSize={{ base: "sm", md: "md" }}
            color="var(--color-text)"
            _groupHover={{ color: "var(--color-primary)" }}
            noOfLines={1}
          >
            {category.name}
          </Text>
        </Box>
      </Box>
    );
  }
);
CategoryGridItem.displayName = "CategoryGridItem";

// ─── Skeleton View for Category Products ─────────────────────────────────
const CategoryProductsSkeleton = memo(() => (
  <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
    {[...Array(8)].map((_, i) => (
      <Box key={i} rounded="2xl" p={3} borderWidth="1px" borderColor="gray.100">
        <Skeleton h="200px" rounded="xl" mb={3} />
        <Skeleton h="16px" w="70%" mb={2} />
        <Skeleton h="14px" w="40%" />
      </Box>
    ))}
  </SimpleGrid>
));
CategoryProductsSkeleton.displayName = "CategoryProductsSkeleton";

// ─── View when a specific category slug is selected ──────────────────────
const CategoryProductsView = memo(
  observer(({ slug }: { slug: string }) => {
    const { shopStore } = stores;
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      let isMounted = true;

      const fetchProducts = async () => {
        setLoading(true);
        try {
          const response: any = await shopStore.getShopProducts({
            categorySlug: slug,
            page: 1,
            limit: 20,
          });

          if (isMounted && response?.data) {
            setProducts(response.data.products || []);
          }
        } catch {
          if (isMounted) setProducts([]);
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      fetchProducts();

      return () => {
        isMounted = false;
      };
    }, [slug, shopStore]);

    const displayTitle = useMemo(() => {
      const clean = String(slug || "");
      return clean.charAt(0).toUpperCase() + clean.slice(1).replace(/-/g, " ");
    }, [slug]);

    return (
      <Box py={8} minH="80vh" bg="var(--color-bg)">
        <Container maxW="container.xl">
          {/* Breadcrumb */}
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
            mb={8}
            fontSize="sm"
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="var(--color-primary)" fontWeight="medium">
                {displayTitle}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Header */}
          <Box mb={8}>
            <Heading
              as="h1"
              size="xl"
              mb={2}
              textTransform="capitalize"
              color="gray.800"
            >
              {displayTitle}
            </Heading>
            <Text color="gray.600">Explore our collection of {displayTitle}</Text>
          </Box>

          {/* Products Grid / Skeleton / Empty */}
          {loading ? (
            <CategoryProductsSkeleton />
          ) : products.length > 0 ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </SimpleGrid>
          ) : (
            <Flex
              direction="column"
              align="center"
              justify="center"
              bg="white"
              p={12}
              borderRadius="xl"
              border="1px dashed"
              borderColor="gray.200"
            >
              <Text fontSize="lg" fontWeight="medium" color="gray.500">
                No products found in this category.
              </Text>
            </Flex>
          )}
        </Container>
      </Box>
    );
  })
);
CategoryProductsView.displayName = "CategoryProductsView";

// ─── View when no slug is provided - shows all categories ────────────────
const AllCategoriesView = memo(
  observer(() => {
    const router = useRouter();
    const { categories, loading } = categoryStore;

    useEffect(() => {
      if (!categoryStore.categories || categoryStore.categories.length === 0) {
        categoryStore.getAllCategories({ isActive: true });
      }
    }, []);

    const handleCategoryClick = useCallback(
      (category: any) => {
        router.push(
          `/categories?slug=${category.slug || category.name.toLowerCase()}`
        );
      },
      [router]
    );

    return (
      <Box py={8} minH="80vh" bg="var(--color-bg)">
        <Container maxW="container.xl">
          {/* Breadcrumb */}
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
            mb={8}
            fontSize="sm"
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="var(--color-primary)" fontWeight="medium">
                Categories
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Header */}
          <Box mb={8}>
            <Heading
              as="h1"
              size="xl"
              mb={2}
              color="var(--color-text-primary)"
            >
              All Categories
            </Heading>
            <Text color="var(--color-text-muted)">
              Browse through our wide range of categories
            </Text>
          </Box>

          {/* Categories Grid */}
          {loading && (!categories || categories.length === 0) ? (
            <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={6}>
              {[...Array(10)].map((_, i) => (
                <Box key={i} rounded="2xl" p={2} borderWidth="1px" borderColor="gray.100">
                  <Skeleton h={{ base: "140px", md: "180px" }} rounded="xl" mb={3} />
                  <Skeleton h="16px" w="60%" mx="auto" />
                </Box>
              ))}
            </SimpleGrid>
          ) : categories && categories.length > 0 ? (
            <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={6}>
              {categories.map((category) => (
                <CategoryGridItem
                  key={category._id}
                  category={category}
                  onClick={handleCategoryClick}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Flex
              direction="column"
              align="center"
              justify="center"
              bg="var(--color-surface)"
              p={12}
              borderRadius="xl"
              border="1px dashed"
              borderColor="var(--color-border)"
            >
              <Text
                fontSize="lg"
                fontWeight="medium"
                color="var(--color-text-muted)"
              >
                No categories found.
              </Text>
            </Flex>
          )}
        </Container>
      </Box>
    );
  })
);
AllCategoriesView.displayName = "AllCategoriesView";

export default function CategoryClient() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  if (slug) {
    return <CategoryProductsView slug={slug} />;
  }

  return <AllCategoriesView />;
}
