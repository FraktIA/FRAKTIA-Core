import Image from "next/image";
import React from "react";

const frameworks = [
  {
    name: "Eliza OS",
    description:
      "A powerful extensible framework designed for building conversational AI agents with advanced",
    highlight: true,
  },
  {
    name: "Lang Chain",
    description:
      "A powerful extensible framework designed for building conversational AI agents with advanced",
    highlight: false,
  },
  {
    name: "Eliza OS",
    description:
      "A powerful extensible framework designed for building conversational AI agents with advanced",
    highlight: false,
  },
  {
    name: "Eliza OS",
    description:
      "A powerful extensible framework designed for building conversational AI agents with advanced",
    highlight: false,
  },
];

const Nodes = () => {
  return (
    <section className="w-[37%] max-w-[444px] scrollbar-hide bg-dark  pl-10 h-[100%]  overflow-y-scroll flex flex-col gap-6">
      <div className="flex  flex-col gap-6">
        {frameworks.map((fw, idx) => (
          <div
            key={fw.name + idx}
            className={`rounded-3xl border-4 ${
              fw.highlight
                ? "border-[#F8FF99]"
                : "border-transparent ring-[1px] ring-inset ring-white/8"
            } bg-bg w-[344px] h-[196px] p-6  flex flex-col gap-4 shadow-lg`}
          >
            <div className="flex items-start justify-between">
              {/* Glowing code icon */}
              <Image
                src={"/icons/code.svg"}
                width={32}
                height={32}
                alt="code"
              />
              {/* 3-dot menu */}
              <span className="flex items-center justify-center w-8 h-8">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="6" r="1.5" fill="#fff" />
                  <circle cx="12" cy="12" r="1.5" fill="#fff" />
                  <circle cx="12" cy="18" r="1.5" fill="#fff" />
                </svg>
              </span>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <span className=" font-semibold text-white leading-tight">
                {fw.name}
              </span>
              <p className="text-xs font-light text-white leading-snug break-words">
                {fw.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Nodes;
