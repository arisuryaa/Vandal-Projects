import React from "react";
import { useForm } from "react-hook-form";
import useDocumentTitle from "../../hook/useDocumentTitle";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

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
    <div className="min-h-screen flex">
      <ToastContainer position="top-center" autoClose={1400} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[45%] p-8">
        <div className="w-full h-full rounded-3xl bg-primary flex flex-col justify-between p-12 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-8 right-8 flex gap-1">
            <div className="w-1 h-16 bg-lime-600 opacity-30 rounded"></div>
            <div className="w-1 h-16 bg-lime-600 opacity-30 rounded"></div>
            <div className="w-1 h-16 bg-lime-600 opacity-30 rounded"></div>
          </div>

          {/* Decorative Dots Bottom Left */}
          <div className="absolute bottom-8 left-8 grid grid-cols-5 gap-2">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-lime-600 opacity-30"></div>
            ))}
          </div>

          <div className="flex justify-center">
            <img src="/element.png" alt="" />
          </div>

          {/* Bottom Text */}
          <div className="text-center">
            <h1 className="text-gray-800 text-3xl font-bold mb-3">Smarter Insights. Smarter Gains.</h1>
            <p className="text-gray-700 text-xs leading-relaxed">
              Every number matters. Get market insights, price updates, and trend
              <br />
              analytics that give you the advantage over everyone else.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}

      <div className="w-full lg:w-1/2 xl:w-[55%] flex items-center justify-center p-6 lg:p-12">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex justify-end mb-8 lg:absolute lg:top-8 lg:right-12">
              <img src="/logo.svg" alt="" />
            </div>

            {/* Form Content */}
            <div className="text-center mb-8 mt-10">
              <h1 className="text-white text-3xl  font-bold mb-2">Login To Your Account</h1>
              <p className="text-gray-400 text-sm">Send,spend and save smarter</p>
            </div>

            {/* Social Login Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <button className="flex-1 flex items-center justify-center gap-3 px-2 py-3 bg-transparent border border-gray-600 rounded-xl hover:border-gray-400 transition-colors">
                <FcGoogle className="text-xl" />
                <span className="text-white text-sm">Login with google</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-3 px-2 py-3 bg-transparent border border-gray-600 rounded-xl hover:border-gray-400 transition-colors">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <FaFacebookF className="text-white text-xs" />
                </div>
                <span className="text-white text-sm">Login with Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-gray-700"></div>
              <span className="text-gray-500 text-sm">or with email</span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  {...register("email")}
                  className="w-full px-6 py-3 placeholder:text-sm text-sm bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-lime-400 transition-colors"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Enter Your Password"
                  {...register("password")}
                  className="w-full px-6 py-3 placeholder:text-sm text-sm bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-lime-400 transition-colors"
                />
              </div>

              {/* Terms */}
              <p className="text-gray-400 text-sm leading-6 ">
                By creating account, you agreeing to our <span className="text-white font-medium">Privacy Policy</span> and{" "}
                <span className="text-white font-medium">Electronic Communication Policy</span>
              </p>

              {/* Submit Button */}
              <button onClick={handleSubmit} className="w-full py-2 bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold rounded-xl transition-colors">
                Login
              </button>

              {/* Sign In Link */}
              <p className="text-center text-gray-400 text-sm">
                Doesn't Have An Account?{" "}
                <Link to={"/Register"} className="text-lime-400 hover:text-lime-300 font-medium cursor-pointer">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
