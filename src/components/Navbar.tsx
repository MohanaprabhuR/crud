"use client";
import Link from "next/link";
import React from "react";
import { myAppHook } from "@/context/AppUtils";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, setAuthToken } = myAppHook();

  const router = useRouter();

  const handleUserLogout = async () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setAuthToken(null);
    await supabase.auth.signOut();
    toast.success("User logged out successfully");
    router.push("/auth/login");
  };
  return (
    <div>
      <nav className="navbar flex justify-between bg-[#343a40] py-6 px-6">
        <Link
          className="text-white text-decoration-none text-lg font-bold hover:scale-105 transition-all ease-in delay-100"
          href="/"
        >
          SupaNext
        </Link>

        {isLoggedIn ? (
          <div className="flex gap-[0_16px]">
            <Link
              className=" text-white text-decoration-none text-lg font-semibold hover:scale-105 transition-all ease-in delay-100 "
              href="/auth/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className=" text-white text-decoration-none text-lg font-semibold hover:scale-105 transition-all ease-in delay-100"
              href="/auth/profile"
            >
              Profile
            </Link>
            <button
              className="text-red-700 text-decoration-none text-lg font-semibold hover:scale-105 transition-all ease-in delay-100"
              onClick={handleUserLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-[0_16px]">
            <Link
              className=" text-white text-decoration-none text-lg font-semibold hover:scale-105 transition-all ease-in delay-100"
              href="/"
            >
              Home
            </Link>
            <Link
              className="text-white text-decoration-none text-lg font-semibold hover:scale-105 transition-all ease-in delay-100"
              href="/auth/login"
            >
              Login
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
