// /app/auth/callback/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        router.replace("/auth/dashboard");
      } else {
        router.replace("/auth/login");
      }
    };
    checkSession();
  }, [router]);

  return <div className="text-center mt-20">Redirecting...</div>;
}
