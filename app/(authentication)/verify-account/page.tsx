'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const VerifyAccountContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return (
    <div>
      <h1>Verify Account</h1>
      <p>Verification ID: {id}</p>
    </div>
  );
};

const VerifyAccount = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyAccountContent />
    </Suspense>
  );
}

export default VerifyAccount;
