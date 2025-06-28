"use client";
import Logo from "@/components/Logo";
import { useAppKit } from "@reown/appkit/react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
// import { DynamicBackground } from "@/components/Background";
import { AgentCard } from "@/components/AgentCard";

export default function Login() {
  const { open } = useAppKit();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const navItems = [
    {
      key: "Framework",
      label: "Framework",
      svg: (
        <svg
          width="24"
          height="24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 4h2c1.414 0 2.121 0 2.56.44C19 4.878 19 5.585 19 7m-9-3H8c-1.414 0-2.121 0-2.56.44C5 4.878 5 5.585 5 7m5 13H8c-1.414 0-2.121 0-2.56-.44C5 19.122 5 18.415 5 17m9 3h2c1.414 0 2.121 0 2.56-.44.44-.439.44-1.146.44-2.56m-9-5h4M13 2h-2a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1V3a1 1 0 00-1-1zm0 16h-2a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1zm8-5v-2a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1zM7 13v-2a1 1 0 00-1-1H4a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1z"
            stroke="#232323"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: "AI Model",
      label: "AI Model",
      svg: (
        <svg
          width="24"
          height="24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 4.5a3 3 0 00-2.567 4.554 3.001 3.001 0 000 5.893M7 4.5a2.5 2.5 0 115 0m-5 0c0 .818.393 1.544 1 2m-3.567 8.447A3 3 0 007 19.5a2.5 2.5 0 005 0m-7.567-4.553A3 3 0 016 13.67m6-9.17v15m0-15a2.5 2.5 0 015 0 3 3 0 012.567 4.554M12 19.5a2.5 2.5 0 005 0m0 0a3 3 0 002.567-4.553 3.002 3.002 0 000-5.893M17 19.5c0-.818-.393-1.544-1-2m3.567-8.446A3 3 0 0118 10.329"
            stroke={"#232323"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: "Voice",
      label: "Voice",
      svg: (
        <svg
          width="24"
          height="24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 10v1a6 6 0 006 6m6-7v1a6 6 0 01-6 6m0 0v4m0 0h4m-4 0H8m4-7a3 3 0 01-3-3V6a3 3 0 116 0v5a3 3 0 01-3 3z"
            stroke="#232323"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: "Character",
      label: "Character",
      svg: (
        <svg
          width="24"
          height="24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 9a4 4 0 11-8 0 4 4 0 018 0zm-2 0a2 2 0 11-4 0 2 2 0 014 0z"
            fill="#232323"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM3 12c0 2.09.713 4.014 1.908 5.542A8.99 8.99 0 0112.065 14a8.98 8.98 0 017.092 3.458A9.001 9.001 0 103 12zm9 9a8.96 8.96 0 01-5.672-2.012A6.99 6.99 0 0112.065 16a6.99 6.99 0 015.689 2.92A8.96 8.96 0 0112 21z"
            fill="#232323"
          />
        </svg>
      ),
    },
    {
      key: "Add-ons",
      label: "Add-ons",
      svg: (
        <svg
          width="24"
          height="24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.116 8.5h7.769v-1h-7.77l.001 1zm0 4h4.769v-1h-4.77l.001 1zm10.384 7v-3h-3v-1h3v-3h1v3h3v1h-3v3h-1zm-14-.711V5.115c0-.445.158-.825.475-1.141a1.56 1.56 0 011.14-.475h11.77c.444 0 .824.158 1.14.475.316.317.474.697.475 1.14v4.902a9.297 9.297 0 00-.385-.014 24.579 24.579 0 00-.384-.003c-1.593 0-2.947.557-4.06 1.672-1.113 1.115-1.67 2.468-1.671 4.059l.003.385c.002.128.007.256.014.384H5.79l-2.29 2.29z"
            fill="#232323"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      ref={containerRef}
      className="flex bg-[#191919] h-screen flex-col px-[8%] animated-bg relative overflow-hidden"
    >
      <Image
        src={"/images/bg.png"}
        fill
        className="object-cover opacity-70"
        alt="bg"
      />
      {/* <DynamicBackground type="neural" /> */}

      {/* Animated header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex w-full lg:mt-[60px] justify-between items-center relative z-10"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Logo />
        </motion.div>
        <div className="p-3.5 gap-6 hidden justify-center lg:flex items-center rounded-[12px] glas bg-[#191919]">
          <motion.button
            className="flex text-[#232323] rounded-[4px] justify-center items-center gap-1 w-[171px] h-[36px] bg-primary btn-interactive cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => open()}
          >
            <p className="text-sm uppercase font-medium">Connect Wallet</p>
          </motion.button>
        </div>
      </motion.header>

      {/* Main content section */}
      <section className="flex flex-col mt-[1.5%] lg:mt-[3%] gap-[15%] lg:gap-[5%] lg:h-[60%] lg:flex-row items-center lg:w-[85%] relative z-10">
        {/* Hero text with parallax */}
        <motion.div
          style={{ y: textY }}
          className="max-w-[585px] self-start lg:mt-[12%]"
        >
          <motion.h4
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-[32px] lg:text-5xl leading-[52px] lg:leading-[60px] text-white font-medium"
          >
            <motion.span
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="bg-gradient-to-r from-white via-primary to-white bg-[length:200%_100%] bg-clip-text text-transparent"
            >
              Design, Configure and Build
            </motion.span>{" "}
            your own AI Agent
          </motion.h4>

          <motion.p
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="text-white/80 mt-5 lg:mt-6 text-base lg:text-lg"
          >
            Deploy No-Code Agents in minutes
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(248, 255, 153, 0.3)",
            }}
            onClick={() => open()}
            whileTap={{ scale: 0.95 }}
            className="flex mt-10 lg:hidden text-base text-[#232323] h-[48px] active:scale-90 duration-300 rounded-[8px] justify-center items-center gap-1 w-full bg-primary btn-interactive font-medium"
          >
            Connect Wallet
          </motion.button>
        </motion.div>

        {/* Interactive right section */}
        <div className="flex-1 relative self-end  flex flex-col parallax-container">
          {/* Create new agent button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            whileHover={{
              scale: 1.1,
              rotate: [0, -1, 1, 0],
              transition: { duration: 0.2 },
            }}
            className="bg-dark/80 backdrop-blur-sm border border-primary/30 absolute bottom-[22%] lg:bottom-[14%] scale-60 lg:scale-100 -left-[78%] lg:left-[17%] w-max text-primary font-semibold text-sm  rounded-[20px]  hover:neon-glow transition-all duration-300"
          >
            <p className="btn-interactive  p-6  w-full h-full rounded-[20px]">
              + Create new agent
            </p>
          </motion.button>

          {/* Agent cards with staggered animation */}
          <AgentCard
            src="/images/claude.png"
            name="Claudia AI"
            id="1923e984fg991"
            className="scale-60 lg:scale-100 absolute -left-[140%] lg:-left-[8%] mt-[40%] lg:mt-0"
            delay={0.8}
          />

          <AgentCard
            src="/images/javanu.png"
            name="Javanu"
            id="1923e984fg991"
            className="scale-60 lg:scale-100 absolute -left-[70%] -top-[10%] lg:-top-[50%] lg:left-[25%]"
            delay={1.2}
          />

          {/* Enhanced navigation menu */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex mb-[5%] scale-60 lg:scale-100 flex-col self-end"
          >
            {navItems.map((item, index) => (
              <motion.button
                key={item.key}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 1.7 + index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.05,
                  x: 10,
                  transition: { duration: 0.2 },
                }}
                className="flex pl-[23px] relative items-center gap-[13px] py-3 focus:outline-none group cursor-pointer"
              >
                {/* Enhanced L-shaped SVG connectors */}
                {index === 0 ? (
                  <motion.svg
                    animate={{
                      pathLength: [0, 1],
                      opacity: [0, 1],
                    }}
                    transition={{
                      duration: 1,
                      delay: 2 + index * 0.2,
                    }}
                    className="absolute left-0 top-[24px] h-max"
                    width="20"
                    height="65"
                    viewBox="0 0 20 65"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.path
                      d="M4 40 V10 a8 8 0 0 1 8 -8 h4"
                      stroke="#F8FF99"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                      pathLength="0"
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 2.2 }}
                    />
                  </motion.svg>
                ) : index === 1 ? (
                  <motion.svg
                    className="absolute left-0 bottom-[24px] h-max"
                    width="20"
                    height="65"
                    viewBox="0 0 20 65"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.path
                      d="M4 0 v50 a8 8 0 0 0 8 8 h4"
                      stroke="#F8FF99"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                      pathLength="0"
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 2.4 }}
                    />
                  </motion.svg>
                ) : (
                  <motion.svg
                    className="absolute left-0 bottom-[24px] h-max"
                    width="20"
                    height="85"
                    viewBox="0 0 20 85"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.path
                      d="M4 0 v75 a8 8 0 0 0 8 8 h4"
                      stroke="#F8FF99"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                      pathLength="0"
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 2.6 + index * 0.1 }}
                    />
                  </motion.svg>
                )}

                <motion.span
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 0 20px rgba(248, 255, 153, 0.5)",
                  }}
                  className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 bg-primary"
                >
                  {item.svg}
                </motion.span>

                <motion.span
                  whileHover={{ color: "#F8FF99" }}
                  className="text-base cursor-pointer font-medium transition-all duration-200 text-primary"
                >
                  {item.label}
                </motion.span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
