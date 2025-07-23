"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("OAuth session error:", error.message);
        router.replace("/auth/login");
      } else if (data?.session) {
        router.replace("/auth/dashboard");
      }
    };

    checkSession();
  }, [router]);

  return <p className="text-center mt-16">Signing in, please wait...</p>;
}
