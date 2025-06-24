import React from "react";

const Navbar = () => {
  return (
    <nav className="p-2 bg-[#afdeff] flex items-center justify-between w-[100vw]">
      <img src="/logo.svg" width="120" alt="Logo" className="" />
      <div className="flex gap-5 pl-2">
        <ul className="flex gap-5 text-[#797979] font-bold cursor-pointer">
          <li>
            Pending
            <br />
            Proposals
          </li>
          <li>
            Proposals
            <br />
            Status
          </li>
        </ul>
        <button className="cursor-pointer px-5 py-2 rounded-full text-white font-bold text-lg bg-[#C62828] active:translate-y-1 hover:-translate-y-0.5">
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
