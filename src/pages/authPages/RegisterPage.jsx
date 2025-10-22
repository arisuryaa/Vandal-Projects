import React from "react";
import { useForm } from "react-hook-form";
import useDocumentTitle from "../../hook/useDocumentTitle";
import { Link } from "react-router";

const LoginPage = () => {
  useDocumentTitle("Vandal | Login");
  const { handleSubmit, register, reset } = useForm();

  const handleFormSubmit = async (data) => {
    try {
      alert("sukses");
      console.log(data);
    } catch (error) {
      console.log(error);
    }
    reset();
  };

  return (
    <>
      <div className="flex min-h-screen gap-5">
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
            </div>
            <div className="flex flex-col w-full">
              <input type="password" className="w-full bg-slate-800 px-4 py-2 rounded-lg placeholder:text-sm" placeholder="Masukkan password" {...register("password")} required />
            </div>
            <button className="cursor-pointer bg-primary py-2 rounded-lg font-semibold">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
