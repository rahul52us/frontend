// components/RoleSelector.tsx
import {
    Box,
    BoxProps,
    Flex,
    HStack,
    Text,
} from '@chakra-ui/react';
import React from 'react';

export type Intent = 'user' | 'seller';

export interface RoleOption {
  value: Intent;
  label: string;
  sub: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
}

interface RoleSelectorProps extends Omit<BoxProps, 'onChange'> {
  options: RoleOption[];
  value: Intent;
  onChange: (value: Intent) => void;
  userColor?: string;
  sellerColor?: string;
}

const colorPalettes: Record<Intent, { primary: string; glow: string; bg: string; border: string; text: string; subText: string }> = {
  user: {
    primary: '#0EA5E9',
    glow: '#38BDF8',
    bg: 'rgba(14, 165, 233, 0.08)',
    border: 'rgba(14, 165, 233, 0.3)',
    text: '#0369A1',
    subText: '#0EA5E9',
  },
  seller: {
    primary: '#8B5CF6',
    glow: '#A78BFA',
    bg: 'rgba(139, 92, 246, 0.08)',
    border: 'rgba(139, 92, 246, 0.3)',
    text: '#5B21B6',
    subText: '#8B5CF6',
  },
};

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  options,
  value,
  onChange,
  userColor,
  sellerColor,
  ...boxProps
}) => {
  const getColors = (intentType: Intent) => {
    const base = colorPalettes[intentType];
    const custom = intentType === 'user' ? userColor : sellerColor;
    if (!custom) return base;
    return {
      ...base,
      primary: custom,
      glow: custom,
      bg: `${custom}14`,
      border: `${custom}4D`,
      text: custom,
      subText: custom,
    };
  };

  return (
    <Box position="relative" {...boxProps}>
      <Text
        fontSize="xs"
        fontWeight="700"
        color="gray.500"
        mb={3}
        letterSpacing="0.05em"
        textTransform="uppercase"
      >
        I want to join as
      </Text>

      <HStack spacing={{ base: 2, md: 3 }}>
        {options.map(({ value: optionValue, label, sub, icon: Icon }) => {
          const isActive = value === optionValue;
          const c = isActive ? getColors(optionValue) : null;

          return (
            <Box
              key={optionValue}
              as="button"
              type="button"
              flex={1}
              onClick={() => onChange(optionValue)}
              position="relative"
              overflow="hidden"
              border="1.5px solid"
              borderColor={isActive ? c!.border : 'gray.200'}
              borderRadius="xl"
              bg={isActive ? c!.bg : 'white'}
              p={{ base: 2, md: 3 }}
              cursor="pointer"
              transition="all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
              transform={isActive ? 'scale(1.02)' : 'scale(1)'}
              boxShadow={
                isActive
                  ? `0 0 20px ${c!.primary}25, 0 4px 12px ${c!.primary}15`
                  : '0 1px 2px rgba(0,0,0,0.05)'
              }
              _hover={{
                borderColor: isActive ? c!.border : 'gray.300',
                boxShadow: isActive
                  ? `0 0 30px ${c!.primary}35, 0 6px 16px ${c!.primary}20`
                  : '0 2px 8px rgba(0,0,0,0.08)',
                transform: 'scale(1.02)',
              }}
              _active={{
                transform: 'scale(0.98)',
                transition: 'all 0.1s',
              }}
              textAlign="left"
            >
              {isActive && (
                <>
                  <Box
                    position="absolute"
                    top="20%"
                    left="10%"
                    w="3px"
                    h="3px"
                    borderRadius="full"
                    bg={c!.glow}
                    opacity={0.6}
                    sx={{ animation: 'float 3s ease-in-out infinite' }}
                  />
                  <Box
                    position="absolute"
                    top="60%"
                    right="15%"
                    w="2px"
                    h="2px"
                    borderRadius="full"
                    bg={c!.glow}
                    opacity={0.4}
                    sx={{ animation: 'float 3s ease-in-out infinite 1s' }}
                  />
                </>
              )}

              {isActive && (
                <Box
                  position="absolute"
                  top={0}
                  left="-100%"
                  w="50%"
                  h="full"
                  bg={`linear-gradient(90deg, transparent, ${c!.primary}15, transparent)`}
                  sx={{ animation: 'shimmer 2s infinite' }}
                  pointerEvents="none"
                />
              )}

              <HStack spacing={{ base: 2, md: 3 }} position="relative" zIndex={1}>
                <Flex
                  w={{ base: '28px', md: '40px' }}
                  h={{ base: '28px', md: '40px' }}
                  borderRadius={isActive ? 'lg' : 'md'}
                  bg={isActive ? `${c!.primary}15` : 'gray.50'}
                  align="center"
                  justify="center"
                  flexShrink={0}
                  transition="all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                  position="relative"
                  boxShadow={isActive ? `0 0 12px ${c!.primary}30` : 'none'}
                >
                  <Icon
                    size={isActive ? 16 : 14}
                    color={isActive ? c!.primary : '#9CA3AF'}
                    strokeWidth={isActive ? 2.5 : 2}
                  />

                  {isActive && (
                    <Box
                      position="absolute"
                      inset="-3px"
                      borderRadius={isActive ? 'xl' : 'lg'}
                      border="1.5px solid"
                      borderColor={`${c!.primary}40`}
                      sx={{ animation: 'spin 4s linear infinite' }}
                    >
                      <Box
                        position="absolute"
                        top="-2px"
                        left="50%"
                        transform="translateX(-50%)"
                        w="3px"
                        h="3px"
                        borderRadius="full"
                        bg={c!.glow}
                        boxShadow={`0 0 6px ${c!.glow}`}
                      />
                    </Box>
                  )}
                </Flex>

                <Box flex={1}>
                  <Text
                    fontWeight="700"
                    fontSize={{ base: 'xs', md: 'sm' }}
                    color={isActive ? c!.text : 'gray.700'}
                    lineHeight="1.2"
                    transition="color 0.3s ease"
                  >
                    {label}
                  </Text>
                  <Text
                    display={{ base: 'none', md: 'block' }}
                    fontSize="xs"
                    color={isActive ? c!.subText : 'gray.400'}
                    mt="2px"
                    fontWeight="500"
                    transition="color 0.3s ease"
                  >
                    {sub}
                  </Text>
                </Box>

                <Box
                  w={{ base: '14px', md: '18px' }}
                  h={{ base: '14px', md: '18px' }}
                  borderRadius="full"
                  bg={isActive ? c!.primary : 'transparent'}
                  border={isActive ? 'none' : '2px solid'}
                  borderColor="gray.200"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  transition="all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                  flexShrink={0}
                  boxShadow={isActive ? `0 0 8px ${c!.primary}50` : 'none'}
                >
                  {isActive && (
                    <Box
                      as="svg"
                      viewBox="0 0 24 24"
                      w={{ base: '8px', md: '10px' }}
                      h={{ base: '8px', md: '10px' }}
                      fill="none"
                      stroke="white"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      sx={{ animation: 'check-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </Box>
                  )}
                </Box>
              </HStack>
            </Box>
          );
        })}
      </HStack>

      <Box
        as="style"
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-8px); }
            }
            @keyframes shimmer {
              0% { left: -100%; }
              100% { left: 200%; }
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes check-pop {
              0% { transform: scale(0); opacity: 0; }
              70% { transform: scale(1.2); }
              100% { transform: scale(1); opacity: 1; }
            }
          `,
        }}
      />
    </Box>
  );
};