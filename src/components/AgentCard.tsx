import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

interface AgentCardProps {
  src: string;
  name: string;
  id: string;
  className?: string;
  delay?: number;
}

export const AgentCard = ({
  src,
  name,
  id,
  className = "",
  delay = 0,
}: AgentCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      whileHover={{
        scale: 1.05,
        y: -5,
        transition: { duration: 0.2 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`flex gap-4.5 bg-dark/80 backdrop-blur-sm border border-primary/20 justify-center w-[250px] h-[97px] rounded-[20px] items-center cursor-pointer transition-all duration-300 ${className} ${
        isHovered ? "neon-glow" : ""
      }`}
    >
      <motion.div
        animate={{ rotate: isHovered ? 360 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src={src}
          width={67}
          height={67}
          alt={name}
          className="rounded-full"
        />
      </motion.div>
      <div className="flex flex-col gap-2">
        <motion.p
          className="text-white font-semibold text-[20px]"
          animate={{ color: isHovered ? "#F8FF99" : "#ffffff" }}
        >
          {name}
        </motion.p>
        <p className="text-white/70 font-light text-xs">ID: {id}</p>
      </div>
    </motion.div>
  );
};
