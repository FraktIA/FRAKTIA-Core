import Header from "@/components/Header";
import Nodes from "@/components/Nodes";

export default function Manage() {
  return (
    <div className="flex flex-col  h-full">
      {/* Framework selection */}
      <Header />
      <div className="flex h-[88%] ">
        <Nodes />
        {/* Agent Builder */}
        {/* <section className="flex-1 flex flex-col p-8 gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#E6E8EC]">
              Agent Builder
            </h2>
            <div className="bg-[#23262F] rounded-lg px-4 py-2 text-xs text-[#B1B5C3] flex items-center gap-2">
              <span>Completion</span>
              <span className="bg-[#FFD600] text-[#23262F] rounded px-2 py-0.5 font-bold">
                20% Done
              </span>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-[#353945] rounded-xl bg-[#181A20]">
            <span className="text-[#B1B5C3] text-center">
              Drag and drop components here
              <br />
              Start by building your agent by adding components from the sidebar
            </span>
          </div>
          <div className="flex justify-between mt-4">
            <button className="bg-[#23262F] text-[#B1B5C3] rounded-lg px-8 py-2 font-semibold">
              &larr; Previous
            </button>
            <button className="bg-[#FFD600] text-[#23262F] rounded-lg px-8 py-2 font-semibold">
              Next &rarr;
            </button>
          </div>
        </section> */}
      </div>
    </div>
  );
}
