import { Icon } from "@iconify/react";

interface IconButtonProps {
  iconName: string;
  text: string;
  color?: string;
  onClick?: () => void;
  className?: string;
}

export const IconButton = ({
  iconName,
  text,
  color = "#ffffff",
  onClick,
  className = "",
}: IconButtonProps) => {
  return (
    <div
      className={`flex p-6 w-[80px]   lg:w-[150px] h-[48px] lg:h-[60px] justify-center rounded-[10px] items-center gap-3 bg-[#191919] cursor-pointer hover:bg-[#252525] transition-all duration-200 ${className}`}
      onClick={onClick}
    >
      <div className="text-xs lg:text-xl">
        <Icon icon={iconName} color={color} />
      </div>
      <p className=" text-[10px] flex lg:text-xs" style={{ color }}>
        {text}
      </p>
    </div>
  );
};
