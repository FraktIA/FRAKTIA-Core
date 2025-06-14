import React from "react";

const Logo = () => {
  return (
    <div className="flex w-max h-max items-center gap-2  py-5 relative">
      <span className="w-[14px] h-[14px] lg:w-5 lg:h-5  bg-primary rounded-full"></span>
      <span className="text-base lg:text-2xl text-primary font-light">
        FRAKTIA
      </span>
    </div>
  );
};

export default Logo;
