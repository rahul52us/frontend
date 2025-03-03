'use client';

import { useParams } from 'next/navigation';

const VerifyAccount = () => {
  const params = useParams();
  const id = params?.id;

  return (
    <div>
      <h1>Verify Account</h1>
      <p>Verification ID: {id}</p>
    </div>
  );
};

export default VerifyAccount;
