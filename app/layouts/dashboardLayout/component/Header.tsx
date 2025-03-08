'use client';
import {
  Avatar,
  Box,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import React from 'react';
import stores from '../../../store/stores';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import { WEBSITE_TITLE } from '../../../config/utils/variables';

const Header: React.FC = observer(() => {
  const {
    auth: { user, openNotification, logout },
  } = stores;
  const router = useRouter();

  // Logout function
  const handleLogout = () => {
    logout();
    openNotification({
      title: 'Logged out successfully',
      message: 'You have been logged out.',
      type: 'success',
    });
    router.push('/login');
  };

  return (
    <Box as="header">
      <Flex justify="space-between" align="center" px={6}>
        {/* Brand Name */}
        <Heading size="md" color="white" fontWeight="bold">
          {WEBSITE_TITLE}
        </Heading>

        <Flex align="center" gap={4}>
          {/* Mobile Menu Icon */}
          <IconButton
            aria-label="Open Menu"
            icon={<FiMenu />}
            variant="ghost"
            color="white"
            _hover={{ bg: 'blue.700' }}
            display={{ base: 'flex', md: 'none' }} // Hide on larger screens
            size="lg"
          />

          {/* Avatar and Dropdown Menu */}
          <Menu>
            <MenuButton>
              <Flex align="center" gap={2}>
                <Avatar
                  size="sm"
                  name={user?.name || 'User'}
                  src={user?.pic?.url || 'https://bit.ly/broken-link'}
                />
                <Text
                  color="white"
                  fontSize="sm"
                  display={{ base: 'none', md: 'block' }}
                >
                  {user?.name || 'Guest'}
                </Text>
              </Flex>
            </MenuButton>
            <MenuList
              borderColor="gray.300"
              borderRadius="md"
              boxShadow="md"
              minWidth="200px"
              p={2}
              zIndex={10}
            >
              {/* Profile Item */}
              <MenuItem
                 bgColor="blue.400"
                _hover={{
                  bg: 'blue.100',
                  color: 'blue.600',
                  transform: 'translateX(4px)',
                  transition: 'transform 0.2s ease, background-color 0.2s',
                }}
                fontWeight="bold"
                fontSize="sm"
              >
                Profile
              </MenuItem>

              {/* Settings Item */}
              <MenuItem
                _hover={{
                  bg: 'blue.100',
                  color: 'blue.600',
                  transform: 'translateX(4px)',
                  transition: 'transform 0.2s ease, background-color 0.2s',
                }}
                fontWeight="bold"
                fontSize="sm"
              >
                Settings
              </MenuItem>

              {/* Logout Item */}
              <MenuItem
                _hover={{
                  bg: 'red.500',
                  color: 'white',
                  transform: 'translateX(4px)',
                  transition: 'transform 0.2s ease, background-color 0.2s',
                }}
                fontWeight="bold"
                fontSize="sm"
                onClick={handleLogout}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
});

export default Header;
