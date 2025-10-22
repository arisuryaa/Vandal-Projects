import React from "react";
import { useForm } from "react-hook-form";
import useDocumentTitle from "../../hook/useDocumentTitle";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

const LoginPage = () => {
  const navigate = useNavigate();
  const notify = (text) => {
    toast(text);
  };

  useDocumentTitle("Vandal | Login");
  const loginSchema = z.object({
    email: z.string().email("email Tidak Valid").min(8),
    password: z.string().min(5).max(15),
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const handleFormSubmit = async ({ email, password }) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      notify("Login Success");
      console.log(result);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      notify(`${error.message}`);
      console.log(error);
    }
    reset();
  };

  return (
    <>
      <div className="flex min-h-screen gap-5">
        <ToastContainer position="top-center" autoClose={1400} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
        <Link to={"/"} className="absolute right-20 top-8">
          <img src="/public/logo.svg" className="" alt="" />
        </Link>
        <div className="w-[60%] h-screen">
          <img src="/public/login.jpg" alt="" className="h-full" />
        </div>
        <div className="flex flex-col gap-4  justify-center  w-1/2 px-20">
          <h1 className="text-3xl font-semibold">Login To Your Account</h1>
          <div className="flex items-center gap-1 text-sm">
            <p>Doesn't have account?</p>
            <Link to={"/register"} className="underline">
              Register
            </Link>
          </div>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <input type="email" className="w-full bg-slate-800 px-4 py-2 rounded-lg placeholder:text-sm" placeholder="Masukkan email" {...register("email")} required />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col w-full">
              <input type="password" className="w-full bg-slate-800 px-4 py-2 rounded-lg placeholder:text-sm" placeholder="Masukkan password" {...register("password")} required />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
            <button className="cursor-pointer bg-primary py-2 rounded-lg font-semibold">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
