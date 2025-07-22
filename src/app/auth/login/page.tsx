"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "../../../../lib/supabase";
import toast from "react-hot-toast";
import { myAppHook } from "@/context/AppUtils";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { register } from "module";

const formSchema = yup.object().shape({
  email: yup.string().required("Email is Required").email("Invaild Email"),
  password: yup.string().required("Password is Required"),
});

const Login = () => {
  const router = useRouter();

  const { isLoggedIn, setIsLoggedIn, setAuthToken } = myAppHook();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session?.user) {
        router.push("/auth/dashboard");
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/auth/dashboard");
    }
  }, [isLoggedIn]);

  const handleSocialOauth = async (provider: "google" | "github") => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/dashboard`,
      },
    });
    if (error) {
      toast.error("Faild to login via social Oauth");
    }
  };

  const onSubmit = async (formdata: any) => {
    const { email, password } = formdata;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toast.error("Invalid login details");
    } else {
      if (data.session?.access_token) {
        setAuthToken(data.session?.access_token);
        localStorage.setItem("acces_token", data.session?.access_token);
        setIsLoggedIn(true);
        toast.success("User logged in successfully");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="mt-5">
        <h2 className="text-center">Login</h2>
        <form className="w-50 mx-auto mt-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control border"
              {...register("email")}
            />
            <p className="text-danger">{errors.email?.message}</p>
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control border"
              {...register("password")}
            />
            <p className="text-danger">{errors.password?.message}</p>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <button
            className="btn btn-danger mx-2"
            onClick={() => handleSocialOauth("google")}
          >
            Google
          </button>
          <button
            className="btn btn-dark mx-2"
            onClick={() => handleSocialOauth("github")}
          >
            GitHub
          </button>
        </div>

        <p className="text-center mt-3">
          Don&apos;t have an account? <a href="/auth/register">Register</a>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
