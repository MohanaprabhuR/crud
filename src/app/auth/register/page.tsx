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

  const onSubmit = async (formdata: any) => {
    const { fullname, email, password, phone, gender } = formdata;

    const { data, error } = await supabase.auth.signUp({
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
      <div className="container mt-5">
        <h2 className="text-center">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="w-50 mx-auto mt-3">
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control border"
                {...register("fullname")}
              />
              <p className="text-danger">{errors.fullname?.message}</p>
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control border"
                {...register("email")}
              />
              <p className="text-danger">{errors.email?.message}</p>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control border"
                {...register("phone")}
              />
              <p className="text-danger">{errors.phone?.message}</p>
            </div>
            <div className="col-md-6">
              <label className="form-label">Gender</label>
              <select className="form-control border" {...register("gender")}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <p className="text-danger">{errors.gender?.message}</p>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control border"
                {...register("password")}
              />
              <p className="text-danger">{errors.password?.message}</p>
            </div>
            <div className="col-md-6">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control border"
                {...register("confirm_password")}
              />
              <p className="text-danger">{errors.confirm_password?.message}</p>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account? <a href="/auth/login">Login</a>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
