import { Box, Divider, Text } from '@chakra-ui/react';
import ProductTitle from '../../../individual-product/component/ProductTitle/ProductTitle';
import ProductRating from '../../../individual-product/component/ProductRating/ProductRating';
import ProductPrice from '../../../individual-product/component/ProductPrice/ProductPrice';
import CouponOffers from '../../../individual-product/component/CouponOffers.tsx/CouponOffers';
import ProductColorSelector from '../../../individual-product/component/ProductColorSelector/ProductColorSelector';
import ProductSizeSelector from '../../../individual-product/component/ProductSizeSelector/ProductSizeSelector';
import ProductSpecs from '../../../individual-product/component/ProductSpecs/ProductSpecs';
import ReturnExchange from '../../../individual-product/component/ReturnExchange/ReturnExchange';
import { observer } from 'mobx-react-lite';

const ProductDetailsSection = ({ product }: { product: any }) => {
    const {
        name,
        category,
        price,
        rating = 4.5,
        description,
        brand,
        productDetails,
        information,
        stock,
        sku,
        weight
    } = product;

    const currentPrice = Number(price);
    const mrp = currentPrice + (currentPrice * 0.2); // Fake MRP for display
    const discount = Math.round(((mrp - currentPrice) / mrp) * 100);

    const highlights = [
        { label: "Brand", value: brand },
        { label: "SKU", value: sku },
        { label: "Stock", value: stock > 0 ? "In Stock" : "Out of Stock" },
        { label: "Weight", value: weight },
        ...(productDetails ? Object.entries(productDetails).map(([key, value]) => ({ label: key, value: String(value) })) : [])
    ].filter(item => item.value);

    const infoSpecs = information ? Object.entries(information).map(([key, value]) => ({ label: key, value: String(value) })) : [];

    const colors = productDetails?.color ? [productDetails.color] : [];
    const sizes = productDetails?.size ? [productDetails.size] : (productDetails?.ssd ? [productDetails.ssd] : []);

    // Dummy offers
    const offers = [
        "Bank Offer 5% Unlimited Cashback on Axis Bank Credit Card",
        "Special Price Get extra 10% off (price inclusive of discount)",
    ];
    const services = [
        { label: "7 Days Replacement", icon: "return" },
        { label: "Cash on Delivery", icon: "cod" },
    ];

    return (
        <Box>
            <Box p={4} borderWidth={1} rounded={'2xl'}>
                <ProductTitle brand={brand || category || "Generic"} title={name} />
                <ProductRating rating={rating} reviews={120} />
                <ProductPrice price={currentPrice} discount={discount} mrp={mrp} />
                <Divider borderColor={'gray.400'} maxW={'90%'} mx={'auto'} my={4} />

                {colors.length > 0 && <ProductColorSelector colors={colors} />}
                {sizes.length > 0 && <ProductSizeSelector sizes={sizes} />}

                <CouponOffers offers={offers} />
                <Divider borderColor={'gray.400'} maxW={'90%'} mx={'auto'} my={6} />
                <ReturnExchange services={services} />

                {description && (
                    <Box mt={4}>
                        <Text fontSize="md" fontWeight="bold" mb={1}>Description</Text>
                        <Text color="gray.600" fontSize="sm">{description}</Text>
                    </Box>
                )}
            </Box>
            <ProductSpecs specs={highlights} title={'Highlights'} />
            {infoSpecs.length > 0 && <ProductSpecs specs={infoSpecs} title={'Information'} />}
        </Box>
    );
};

export default observer(ProductDetailsSection);
