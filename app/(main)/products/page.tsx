"use client"
import { Box, Grid } from '@chakra-ui/react';
import ProductCard from './components/ProductCard/ProductCard';

const products = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZHVjdHxlbnwwfHwwfHx8Mg%3D%3D",
      category: "Business Supplies",
      name: "Premium Office Chair",
      price: "299.99",
      rating: 4,
      freeShipping: true,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZHVjdHxlbnwwfHwwfHx8Mg%3D%3D",
      category: "Fashion",
      name: "Running Shoes",
      price: "89.99",
      rating: 3,
      freeShipping: true,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8Mg%3D%3D",
      category: "Electronics",
      name: "Wireless Headphones ",
      price: "149.99",
      rating: 5,
      freeShipping: false,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZHVjdHxlbnwwfHwwfHx8Mg%3D%3D",
      category: "Fashion",
      name: "Running Shoes",
      price: "89.99",
      rating: 3,
      freeShipping: true,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZHVjdHxlbnwwfHwwfHx8Mg%3D%3D",
      category: "Fashion",
      name: "Running Shoes",
      price: "89.99",
      rating: 3,
      freeShipping: true,
    },
  ];

const page = () => {
  return (
    <Box maxW={'95%'} mx={'auto'}>
        <Grid templateColumns={'repeat(5,1fr)'} gap={4}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Grid>
{/* <ProductCard
//   product={{
//     images: [
//       'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZHVjdHxlbnwwfHwwfHx8Mg%3D%3D',
//       'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZHVjdHxlbnwwfHwwfHx8Mg%3D%3D',
//       'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2R1Y3R8ZW58MHx8MHx8fDI%3D'
//     ],
//     title: 'Ergonomic Office Chair',
//     category: 'Furniture',
//     price: 299.99,
//     vendor: {
//       name: 'Office Pro',
//       logo: 'vendor-logo.jpg'
//     }
//   }}
/> */}
    </Box>
  )
}

export default page