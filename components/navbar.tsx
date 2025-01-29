"use client"; // Marks this component as client-side

import Link from "next/link";
import { useAuth } from "@/context/authContext";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <nav className="p-4 bg-gray-800">
      <ul className="flex gap-4">
        {!isLoggedIn ? (
          <>
            <li><Link href="/sign-in" className="text-white">Login</Link></li>
            <li><Link href="/register" className="text-white">Signup</Link></li>
          </>
        ) : (
          <>
            <li><Link href="/home" className="text-white">Home</Link></li>
            <li><Link href="/dashboard" className="text-white">Dashboard</Link></li>
            <li>
              <button onClick={handleLogout} className="text-red-500">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
