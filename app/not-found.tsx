'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@chakra-ui/react';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function NotFoundPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div style={containerStyles}>
      <div style={iconWrapperStyles}>
        <FaExclamationTriangle size={80} color="#FF6347" />
      </div>
      <h1 style={headingStyles}>404 - Page Not Found</h1>
      <p style={messageStyles}>
        Oops! The page you are looking for does not exist. It might have been
        moved or deleted.
      </p>
      <div>
        <Button
          onClick={handleGoHome}
          size="lg"
          colorScheme="blue"
          variant="solid"
          _hover={{ backgroundColor: 'blue.600' }}
          _active={{ backgroundColor: 'blue.700' }}
          _focus={{ boxShadow: '0 0 0 2px rgba(66,153,225,0.6)' }}
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
}

const containerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#f4f4f4',
  textAlign: 'center',
  padding: '20px',
};

const iconWrapperStyles: React.CSSProperties = {
  marginBottom: '20px',
};

const headingStyles: React.CSSProperties = {
  fontSize: '3rem',
  color: '#333',
  fontWeight: 'bold',
  marginBottom: '10px',
};

const messageStyles: React.CSSProperties = {
  fontSize: '1.2rem',
  color: '#666',
  marginBottom: '20px',
};
