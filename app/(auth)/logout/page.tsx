import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const Logout: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Simulate logout logic
    console.log('Logging out...');
    
    // Redirect to the home page or sign-in page
    router.push('/sign-in');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Logging Out...</h2>
        <p>Redirecting you to the sign-in page...</p>
      </div>
    </div>
  );
};

export default Logout;
