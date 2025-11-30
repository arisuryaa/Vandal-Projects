import React from "react";

const Loading = ({ isLoading }) => {
  return (
    <div
      className={`fixed top-0 left-0 right-0 bg-backgroundBlack z-[999] h-screen overflow-hidden flex flex-col gap-4 justify-center text-center items-center transition-transform duration-1000 ease-in-out ${
        isLoading ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Logo with pulse animation */}
      <div className="relative">
        <img src="/logo.svg" className="w-24 h-auto animate-pulse" alt="logo" />

        {/* Animated circle around logo */}
      </div>

      {/* Loading text with dots animation */}
      {/* <div className="flex items-center gap-1">
        <h1 className="text-base font-semibold text-white">Loading</h1>
        <div className="flex gap-1">
          <span className="animate-bounce-delay-0 text-primary text-xl font-bold">.</span>
          <span className="animate-bounce-delay-1 text-primary text-xl font-bold">.</span>
          <span className="animate-bounce-delay-2 text-primary text-xl font-bold">.</span>
        </div>
      </div> */}

      {/* Progress bar */}
      <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-yellow-500 animate-progress"></div>
      </div>
      <p className="text-xs">Please Wait...</p>

      {/* Add custom animations to your global CSS or Tailwind config */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce-delay {
          0%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
        }

        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }

        .animate-bounce-delay-0 {
          animation: bounce-delay 1.4s infinite;
          animation-delay: 0s;
        }

        .animate-bounce-delay-1 {
          animation: bounce-delay 1.4s infinite;
          animation-delay: 0.2s;
        }

        .animate-bounce-delay-2 {
          animation: bounce-delay 1.4s infinite;
          animation-delay: 0.4s;
        }

        .animate-progress {
          animation: progress 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;
