import React from "react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import useDocumentTitle from "../../hook/useDocumentTitle";

const LoginPage = () => {
  useDocumentTitle("Vandal | Login Page");
  return (
    <div className="min-h-screen  flex">
      {/* Left Section - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">{/* <div className="text-white text-xl font-semibold mb-2">Icon</div> */}</div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-white text-2xl font-bold mb-2">Selamat Datang kembali</h1>
            <p className="text-gray-300 text-sm">Masuk Dengan Akun Anda</p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="text-left">
              <a href="#" className="text-gray-300 text-sm hover:text-white">
                Lupa Kata Sandi?
              </a>
            </div>

            <button type="submit" className="w-full bg-primary cursor-pointer hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200">
              Masuk Akun
            </button>
          </form>

          {/* Separator */}
          <div className="flex items-center my-6">
            <hr className="flex-1 border-gray-600" />
            <span className="px-4 text-gray-400 text-sm">Atau</span>
            <hr className="flex-1 border-gray-600" />
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 border border-gray-600 hover:border-gray-500 text-white py-3 px-4 rounded-lg transition duration-200">
              <div className="rounded">
                <FaFacebook />
              </div>
              <span>Facebook</span>
              <span className="ml-auto">→</span>
            </button>

            <button className="w-full flex items-center justify-center gap-3 border border-gray-600 hover:border-gray-500 text-white py-3 px-4 rounded-lg transition duration-200">
              <div className=" rounded">
                <FaGoogle />
              </div>
              <span>Google</span>
              <span className="ml-auto">→</span>
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Belum Mempunyai Akun?{" "}
              <a href="/register" className="text-green-500 hover:text-green-400">
                Buat Akun
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-8 h-[40rem] w-3/4">
        <div className="text-center">
          <div className="w-[45rem]  h-[42rem] rounded-lg flex items-center justify-center mb-4">
            <img src="/login.jpg" alt="" className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
