"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { supabase } from "../../../../lib/supabase";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Form validation schema
const formSchema = yup.object().shape({
  fullname: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  gender: yup
    .string()
    .required("Gender is required")
    .oneOf(["Male", "Female", "Other"], "Invalid gender"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirm_password: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

const Register = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (formdata: any) => {
    const { fullname, email, password, phone, gender } = formdata;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { fullname, phone, gender },
      },
    });

    if (error) {
      toast.error(error.message || "Failed to register");
    } else {
      toast.success("Registered successfully. Redirecting to login...");
      await supabase.auth.signOut();

      setTimeout(() => {
        router.push("/auth/login");
      }, 1000);
    }
  };

  return (
    <div>
      <Navbar />
      <section className="py-[120px]">
        <div className="w-[30%] mx-auto">
          <h2 className="text-center text-[40px] leading-[112%] tracking-[-1.4px] text-gray-900 font-bold pb-10">
            Register
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full mx-auto mt-3 bg-white shadow-2xl rounded-[24px] px-8 pt-6 pb-8 mb-4"
          >
            <div className="row mb-3">
              <div className="pb-3">
                <label className="form-label block text-gray-700 text-sm font-bold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="shadow rounded w-full py-2 px-3 text-gray-700"
                  {...register("fullname")}
                />
                <p className="font-normal tex-xs pt-2 text-red-600">
                  {errors.fullname?.message}
                </p>
              </div>
              <div className="pb-3">
                <label className="form-label block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="shadow rounded w-full py-2 px-3 text-gray-700"
                  {...register("email")}
                />
                <p className="font-normal tex-xs pt-2 text-red-600">
                  {errors.email?.message}
                </p>
              </div>
            </div>

            <div className="row mb-3">
              <div className="pb-3">
                <label className="form-label block text-gray-700 text-sm font-bold mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  className="shadow rounded w-full py-2 px-3 text-gray-700"
                  {...register("phone")}
                />
                <p className="font-normal tex-xs pt-2 text-red-600">
                  {errors.phone?.message}
                </p>
              </div>
              <div className="pb-3">
                <label className="form-label block text-gray-700 text-sm font-bold mb-2">
                  Gender
                </label>
                <select
                  className="shadow rounded w-full py-2 px-3 text-gray-700"
                  {...register("gender")}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <p className="font-normal tex-xs pt-2 text-red-600">
                  {errors.gender?.message}
                </p>
              </div>
            </div>

            <div className="row mb-3">
              <div className="pb-3">
                <label className="form-label block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="shadow rounded w-full py-2 px-3 text-gray-700"
                  {...register("password")}
                />
                <p className="font-normal tex-xs pt-2 text-red-600">
                  {errors.password?.message}
                </p>
              </div>
              <div className="pb-3">
                <label className="form-label block text-gray-700 text-sm font-bold mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="shadow rounded w-full py-2 px-3 text-gray-700"
                  {...register("confirm_password")}
                />
                <p className="font-normal tex-xs pt-2 text-red-600">
                  {errors.confirm_password?.message}
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full text-white mt-4 font-medium rounded-lg text-sm px-5 py-2.5 bg-blue-700 hover:bg-blue-800"
            >
              Register
            </button>
          </form>

          <p className="text-center mt-6 font-normal text-base">
            Already have an account?{" "}
            <a href="/auth/login" className="underline font-bold text-blue-700">
              Login
            </a>
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Register;
