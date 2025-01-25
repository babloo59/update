"use client"
import React, { useState } from "react";
import Navbar from "@/components/navbar";
import { AuthProvider } from "@/context/authContext";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
        <AuthProvider>
          <Navbar />
          <section className="w-full relative">
      
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
      
      <div className="h-screen flex items-center justify-center">
        {children}
      </div>
    </section>
        </AuthProvider>
    
  );
};

export default AuthLayout;
