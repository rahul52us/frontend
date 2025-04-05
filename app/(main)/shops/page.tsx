'use client'

import {
  Box,
  Heading,
  Container,
  Text,
  Stack,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  SimpleGrid,
  useColorModeValue,
  IconButton,
  Fade,
} from '@chakra-ui/react'
import { SearchIcon, AddIcon, ArrowUpIcon } from '@chakra-ui/icons'
import React, { useEffect, useState } from 'react'
import ShopSection from '../component/shopSection/ShopSection'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { authentication } from '../../config/utils/routes'

const MotionHeading = motion(Heading)
const MotionBox = motion(Box)

const ShopsPage = () => {
  const router = useRouter()
  const bg = useColorModeValue('gray.50', 'gray.900')
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollBtn(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const categories = ['Grocery', 'Clothing', 'Electronics', 'Restaurants']

  return (
    <Box bg={bg} py={{ base: 10, md: 16 }} minH="100vh" position="relative">
      <Container maxW="7xl">
        {/* Header */}
        <Stack spacing={4} textAlign="center" mb={10}>
          <MotionHeading
            fontSize={{ base: '2xl', md: '4xl' }}
            fontWeight="extrabold"
            bgGradient="linear(to-r, teal.400, green.400)"
            bgClip="text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            🛍️ Explore Nearby Shops
          </MotionHeading>
          <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }}>
            Discover local businesses near you and support your community like a local hero.
          </Text>
        </Stack>

        {/* Search Bar */}
        <InputGroup maxW="lg" mx="auto" mb={6}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a shop, product, or location..."
            borderRadius="xl"
            bg="white"
            shadow="md"
            _focus={{ borderColor: 'teal.400', boxShadow: '0 0 0 1px teal' }}
          />
        </InputGroup>

        {/* Categories */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={8}>
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() =>
                setActiveCategory((prev) => (prev === category ? null : category))
              }
              variant={activeCategory === category ? 'solid' : 'outline'}
              colorScheme="teal"
              borderRadius="full"
              fontWeight="medium"
              _hover={{ bg: 'teal.50' }}
              transition="all 0.2s"
            >
              {category}
            </Button>
          ))}
        </SimpleGrid>

        {/* Shops Section */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <ShopSection />
        </MotionBox>

        {/* Call to Action */}
        <Box
          mt={16}
          bg="teal.500"
          color="white"
          py={10}
          px={6}
          textAlign="center"
          borderRadius="2xl"
          shadow="md"
        >
          <Heading fontSize={{ base: 'xl', md: '2xl' }} mb={2}>
            Are you a shop owner?
          </Heading>
          <Text mb={4}>List your shop for free and reach more local customers.</Text>
          <Button
            colorScheme="whiteAlpha"
            leftIcon={<AddIcon />}
            variant="outline"
            size="lg"
            borderRadius="full"
            _hover={{ bg: 'whiteAlpha.300' }}
            onClick={() => router.push(authentication.register)}
          >
            Register Your Shop
          </Button>
        </Box>
      </Container>

      {/* Scroll to Top */}
      <Fade in={showScrollBtn}>
        <IconButton
          icon={<ArrowUpIcon />}
          onClick={scrollToTop}
          position="fixed"
          bottom="30px"
          right="30px"
          colorScheme="teal"
          aria-label="Scroll to top"
          borderRadius="full"
          zIndex={1000}
          boxShadow="lg"
        />
      </Fade>

      {/* Mobile Register Button */}
      <Box
        display={{ base: 'block', md: 'none' }}
        position="fixed"
        bottom="90px"
        right="20px"
        zIndex={999}
      >
        <IconButton
          icon={<AddIcon />}
          colorScheme="teal"
          aria-label="Register Shop"
          size="lg"
          borderRadius="full"
          shadow="lg"
          onClick={() => router.push(authentication.register)}
        />
      </Box>
    </Box>
  )
}

export default ShopsPage
