"use client";
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "../../../../lib/supabase";
import toast from "react-hot-toast";
import { myAppHook } from "@/context/AppUtils";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ✅ Define TypeScript type for form data
type LoginFormData = {
  email: string;
  password: string;
};

// ✅ Yup schema for form validation
const formSchema = yup.object().shape({
  email: yup.string().required("Email is Required").email("Invalid Email"),
  password: yup.string().required("Password is Required"),
});

const Login = () => {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn, setAuthToken } = myAppHook();

  // ✅ Use typed useForm
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(formSchema),
  });

  // ✅ Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        router.push("/auth/dashboard");
      }
    };
    checkSession();
  }, [router]); // ✅ Add router to deps

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/auth/dashboard");
    }
  }, [isLoggedIn, router]);

  const handleSocialOauth = async (provider: "google" | "github") => {
    const isLocalhost =
      typeof window !== "undefined" && window.location.hostname === "localhost";

    const redirectTo = isLocalhost
      ? "http://localhost:3000/auth/callback"
      : "https://crud-tau-seven.vercel.app/auth/callback";
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    });

    if (error) {
      toast.error("Failed to login via social OAuth");
    }
  };

  // ✅ Typed form data
  const onSubmit = async (formdata: LoginFormData) => {
    const { email, password } = formdata;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Invalid login details");
    } else if (data.session?.access_token) {
      setAuthToken(data.session.access_token);
      localStorage.setItem("acces_token", data.session.access_token);
      setIsLoggedIn(true);
      toast.success("User logged in successfully");
    }
  };

  return (
    <div>
      <Navbar />
      <section className="py-[120px]">
        <div className="w-[30%] mx-auto">
          <h2 className="text-center text-[40px] leading-[112%] tracking-[-1.4px] text-gray-900 font-bold pb-10">
            Login
          </h2>

          <form
            className="w-full mx-auto mt-3 bg-white shadow-2xl rounded-[24px] px-8 pt-6 pb-8 mb-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                className="shadow rounded w-full py-2 px-3 text-gray-700"
                {...register("email")}
              />
              <p className="text-xs pt-2 text-red-600">
                {errors.email?.message}
              </p>
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                className="shadow rounded w-full py-2 px-3 text-gray-700"
                {...register("password")}
              />
              <p className="text-xs pt-2 text-red-600">
                {errors.password?.message}
              </p>
            </div>

            <button
              type="submit"
              className="w-full text-white mt-4 font-medium rounded-lg text-sm px-5 py-2.5 bg-blue-700 hover:bg-blue-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="text-center mt-3 flex flex-col gap-6">
            <button
              className="rounded font-bold text-blue-700 bg-white p-4 shadow-md"
              onClick={() => handleSocialOauth("google")}
            >
              Google
            </button>
            <button
              className="rounded font-bold text-gray-700 bg-white p-4 shadow-md"
              onClick={() => handleSocialOauth("github")}
            >
              GitHub
            </button>
          </div>

          <p className="text-center mt-6 font-normal text-base">
            Don&apos;t have an account?{" "}
            <a
              href="/auth/register"
              className="underline font-bold text-blue-700"
            >
              Register
            </a>
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Login;
