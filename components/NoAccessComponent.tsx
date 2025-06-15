import React from "react";

interface NoAccessComponentProps {
  onTryAnotherAccount?: () => void;
}

const NoAccessComponent: React.FC<NoAccessComponentProps> = ({
  onTryAnotherAccount,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-yellow-200">
      <div className="bg-[#181A1B] rounded-xl shadow-lg flex flex-col items-center px-8 py-10 w-full max-w-md">
        {/* Lock Icon */}
        <div className="bg-yellow-200 rounded-full p-3 mb-6">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="12" fill="#F7F77A" />
            <path
              d="M8 11V8a4 4 0 118 0v3"
              stroke="#181A1B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="6" y="11" width="12" height="7" rx="2" fill="#181A1B" />
            <circle cx="12" cy="15" r="1.5" fill="#F7F77A" />
          </svg>
        </div>
        {/* Main Message */}
        <h2 className="text-lg font-semibold mb-1 text-yellow-200 text-center">
          You do not have access to this app
        </h2>
        {/* Subtext */}
        <p className="text-sm text-yellow-100 mb-6 text-center">
          Have you been invited?
        </p>
        {/* Button */}
        <button
          className="bg-yellow-200 text-black font-medium rounded-md px-8 py-2 mb-8 hover:bg-yellow-100 transition"
          onClick={onTryAnotherAccount}
        >
          Try another account
        </button>
        {/* Branding */}
        <div className="flex items-center gap-2 mt-4">
          <span className="w-3 h-3 bg-yellow-200 rounded-full inline-block"></span>
          <span className="font-semibold tracking-widest text-yellow-200 text-lg">
            FRAKTIA
          </span>
        </div>
      </div>
    </div>
  );
};

export default NoAccessComponent;
