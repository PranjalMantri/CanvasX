import { Paintbrush } from "lucide-react";

function Navbar() {
  return (
    <nav className="z-5 w-full h-14 bg-zinc-900 text-white shadow-lg border-b border-b-[#374151]">
      <div className="flex items-center justify-between mx-10">
        <div className="flex items-center h-12">
          <Paintbrush className="h-6 w-6 text-[#FFA500]" aria-hidden="true" />
          <span className="text-[#FFA500] text-xl font-semibold">CanvasX</span>
        </div>

        <button className="bg-[#FFA500] px-4 py-1.5 rounded-lg font-semibold">
          Share
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
