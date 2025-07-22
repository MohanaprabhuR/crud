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
  }, []);

  // Once Supabase session is confirmed, wait for userProfile from context
  useEffect(() => {
    if (sessionChecked && !userProfile && !isLoggedIn) {
      router.push("/auth/login");
    }
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
      <div className="container mt-5">
        <h2>Profile</h2>
        <div className="card p-4 shadow-sm">
          <p>
            <strong>Name:</strong> {userProfile?.name}
          </p>
          <p>
            <strong>Email:</strong> {userProfile?.email}
          </p>
          <p>
            <strong>Phone:</strong> {userProfile?.phone}
          </p>
          <p>
            <strong>Gender:</strong> {userProfile?.gender}
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
