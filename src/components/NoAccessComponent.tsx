import Image from "next/image";
import React from "react";
import Logo from "./Logo";

interface NoAccessComponentProps {
  onTryAnotherAccount?: () => void;
}

const NoAccessComponent: React.FC<NoAccessComponentProps> = ({
  onTryAnotherAccount,
}) => {
  return (
    <div className="bg-dark justify-center  w-[327px] h-[339px] lg:w-[691px] lg:h-[352px] rounded-[20px] shadow-lg flex flex-col items-center ">
      <div className="flex flex-col items-center mb-6">
        {/* Lock Icon */}
        <div className="bg-primary flex items-center justify-center rounded-full w-12 h-12 ">
          <Image src={"/icons/lock.svg"} alt="lock" width={24} height={24} />
        </div>
        <div className="mt-6 lg:mt-8">
          {/* Main Message */}
          <h2 className="text-sm lg:text-base font-semibold mb-2 text-primary text-center">
            You do not have access to this app
          </h2>
          {/* Subtext */}
          <p className="text-[10px] lg:text-xs text-primary text-center">
            Have you been invited?
          </p>
        </div>
      </div>

      {/* Button */}
      <button
        className="bg-primary hover:cursor-pointer mb-6 text-sm w-[263px] lg:w-[320px] h-[48px] text-[#232323]  rounded-[8px]   hover:bg-yellow-100 transition"
        onClick={onTryAnotherAccount}
      >
        Try another account
      </button>
      {/* Branding */}
      <Logo />
    </div>
  );
};

export default NoAccessComponent;
