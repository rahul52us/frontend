import React from 'react';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const AnimatedWrapper = ({ children, ...props }) => {
  const MotionBox = motion(Box);

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </MotionBox>
  );
};

export default AnimatedWrapper;