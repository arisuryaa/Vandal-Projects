import React from "react";
import { useForm } from "react-hook-form";
import useDocumentTitle from "../../hook/useDocumentTitle";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import { axiosServer } from "../../lib/axios";

const LoginPage = () => {
  const navigate = useNavigate();
  useDocumentTitle("Vandal | Login");
  const notify = (text) => {
    toast(text);
  };

  const registerSchema = z.object({
    email: z.string().email("email Tidak Valid").min(8),
    password: z.string().min(5).max(15),
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const handleFormSubmit = async ({ email, password }) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const token = await user.getIdToken();
      console.log(token);
      console.log(user);

      await axiosServer.post(
        "/register",
        {
          email,
          firebaseUid: user.uid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      notify("Register Success");

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
          <h1 className="text-3xl font-semibold">Register To Your Account</h1>
          <div className="flex items-center gap-1 text-sm">
            <p>Already Have an Account?</p>
            <Link to={"/login"} className="underline">
              Login
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
