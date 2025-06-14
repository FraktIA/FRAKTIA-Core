import React from "react";

const Header = () => {
  return (
    <div className="bg-dark flex justify-between items-center rounded-r-[20px] rounded-tl-[20px]  h-[12%] mr-[22px] pl-10 pr-9 py-4">
      <div className="flex   flex-col gap-1">
        <h1 className="text-[20px] text-white">Framework</h1>
        <p className="text-white/70 text-xs font-light">
          Select Your preferred framework
        </p>
      </div>
      <div className="w-[335px] h-[60px] gap-6 justify-center flex items-center rounded-[15px] bg-bg">
        <p className="text-white">BUY FRAKTIA</p>
        <div className="flex text-[#232323] rounded-[4px] justify-center items-center gap-1 w-[171px] h-[36px] bg-primary">
          <p className=" text-sm">0x8A12X...1f7830</p>
          <svg
            className={`transition-transform hover:cursor-pointer duration-200 w-4 h-4 ${
              true ? "rotate-90" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Header;
