// pages/404.tsx

import React from 'react';
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#ecf0f1', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '3rem', color: '#e74c3c' }}>404 - Page Not Found</h1>
      <p style={{ fontSize: '1.5rem', color: '#34495e' }}>
        The page you are looking for does not exist. Please check the URL or go back to the homepage.
      </p>
      <Link href="/">
        <a
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3498db',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            transition: 'background-color 0.3s ease',
          }}
        >
          Go Back to Homepage
        </a>
      </Link>
    </div>
  );
};

export default NotFoundPage;



