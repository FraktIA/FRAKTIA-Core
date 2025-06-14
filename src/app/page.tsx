"use client";
import Logo from "@/components/Logo";
import Image from "next/image";

export default function Home() {
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
    <div className="flex  h-screen flex-col px-[8%]  bg-[#111]">
      <header className="flex w-full lg:mt-[60px] justify-between   items-center">
        <Logo />
        <div className="p-3.5 gap-6 hidden  justify-center lg:flex items-center rounded-[12px] bg-bg">
          <div className="flex text-[#232323] rounded-[4px] justify-center items-center gap-1 w-[171px] h-[36px] bg-primary">
            <p className=" text-sm uppercase">Connect Wallet</p>
          </div>
        </div>
      </header>
      <section className="flex flex-col mt-[1.5%] lg:mt-[3%] gap-[15%] lg:gap-[5%] lg:h-[60%] lg:flex-row items-center  lg:w-[85%]">
        <div className="max-w-[585px]  self-start lg:mt-[12%]">
          <h4 className="text-[32px] lg:text-5xl leading-[52px] lg:leading-[60px] text-white font-medium">
            Design, Configure and Build your own AI Agent
          </h4>
          <p className="text-white mt-5 lg:mt-6 text-base lg:text-lg">
            Deploy No-Code Agents in minutes
          </p>
          <button className="flex mt-10 lg:hidden text-base text-[#232323] h-[48px] rounded-[8px] justify-center items-center gap-1 w-full bg-primary">
            Connect Wallet
          </button>
        </div>
        <div className="flex-1 relative   self-end flex flex-col">
          <button className="bg-dark absolute bottom-[22%] lg:bottom-[14%] scale-60 lg:scale-100 -left-[78%] lg:left-[17%]  w-max text-primary font-semibold text-sm p-6 rounded-[20px]">
            + Create new agent
          </button>
          <div className="flex gap-4.5 scale-60 lg:scale-100  absolute -left-[140%] lg:-left-[8%]  bg-dark mt-[40%] lg:mt-0 justify-center w-[250px] h-[97px] rounded-[20px] items-center">
            <Image
              src={"/images/claude.png"}
              width={67}
              height={67}
              alt="claude"
              className=""
            />
            <div className="flex flex-col gap-2">
              <p className="text-white font-semibold text-[20px] ">
                Claudia AI
              </p>
              <p className="text-white font-light text-xs">ID: 1923e984fg991</p>
            </div>
          </div>
          <div className="flex scale-60 lg:scale-100  gap-4.5 absolute -left-[70%] -top-[10%] lg:-top-[50%] lg:left-[25%] bg-dark justify-center w-[250px] h-[97px] rounded-[20px] items-center">
            <Image
              src={"/images/javanu.png"}
              width={67}
              height={67}
              alt="javanu"
              className=""
            />
            <div className="flex flex-col gap-2">
              <p className="text-white font-semibold text-[20px] ">Javanu</p>
              <p className="text-white font-light text-xs">ID: 1923e984fg991</p>
            </div>
          </div>
          <div className="flex mb-[5%]  scale-60 lg:scale-100 flex-col self-end">
            {navItems.map((item, index) => (
              <button
                key={item.key}
                className={`flex pl-[23px]  relative items-center gap-[13px] py-3  focus:outline-none group`}
              >
                {/* L-shaped SVG with rightward curve towards the item */}
                {index === 0 ? (
                  <svg
                    className="absolute  left-0 top-[24px] h-max "
                    width="20"
                    height="65"
                    viewBox="0 0 20 65"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 40 V10 a8 8 0 0 1 8 -8 h4"
                      stroke="#F8FF99"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                ) : index === 1 ? (
                  <svg
                    className="absolute left-0 bottom-[24px] h-max"
                    width="20"
                    height="65" // Reduced from 85
                    viewBox="0 0 20 65" // Reduced from 85
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 0 v50 a8 8 0 0 0 8 8 h4" // Changed v70 to v50
                      stroke="#F8FF99"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                ) : (
                  <svg
                    className="absolute  left-0 bottom-[24px] h-max"
                    width="20"
                    height="85"
                    viewBox="0 0 20 85"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 0 v75 a8 8 0 0 0 8 8 h4"
                      stroke="#F8FF99"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                )}
                <span className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 bg-primary">
                  {item.svg}
                </span>
                <span
                  className={`text-base cursor-pointer font-medium transition-all duration-200 text-primary`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
