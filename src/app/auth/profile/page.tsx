"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { myAppHook } from "@/context/AppUtils";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

const Profile = () => {
  const { userProfile, isLoggedIn } = myAppHook();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/auth/login");
      } else {
        setSessionChecked(true);
      }

      setIsLoading(false);
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sessionChecked && !userProfile && !isLoggedIn) {
      router.push("/auth/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionChecked, userProfile, isLoggedIn]);

  if (isLoading || !sessionChecked) {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          <p>Loading profile...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="py-[120px]">
        <div className="mx-auto w-full max-w-[1142px] px-4 max-xl:max-w-[960px] max-lg:max-w-[720px] max-md:max-w-[540px] max-sm:max-w-full max-sm:px-0">
          <div className="w-1/2 mx-auto">
            <h2 className="text-center text-[40px] leading-[112%] tracking-[-1.4px] text-gray-900 font-bold pb-10">
              Profile
            </h2>
            <div className="w-full mx-auto mt-3 bg-white shadow-2xl rounded-[24px] px-8 pt-6 pb-8 mb-4">
              <p className="pb-6 text-base text-gray-700 font-normal">
                <strong>Name:</strong> {userProfile?.name}
              </p>
              <p className="pb-6 text-base text-gray-700 font-normal">
                <strong>Email:</strong> {userProfile?.email}
              </p>
              <p className="pb-6 text-base text-gray-700 font-normal">
                <strong>Phone:</strong> {userProfile?.phone}
              </p>
              <p className="pb-6 text-base text-gray-700 font-normal">
                <strong>Gender:</strong> {userProfile?.gender}
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Profile;
