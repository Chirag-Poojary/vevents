"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      label: (
        <>
          Pending <br /> Proposals
        </>
      ),
      path: "/dashboard/committee/PendingProposals", // adjust based on role
    },
    {
      label: (
        <>
          Proposals <br /> Status
        </>
      ),
      path: "/dashboard/committee/ProposalStatus", // future route
    },
  ];

  return (
    <nav className="p-2 bg-[#afdeff] flex items-center justify-between w-[99vw]">
      <img src="/logo.svg" width="120" alt="Logo" className="ml-3" />

      <div className="flex gap-5 pl-2 items-center">
        <ul className="flex gap-10 font-bold">
          {navItems.map((item, index) => (
            <li
              key={index}
              onClick={() => router.push(item.path)}
              className={`cursor-pointer text-center transition duration-150 ${
                pathname === item.path ? "text-black" : "text-[#797979]"
              }`}
            >
              {item.label}
            </li>
          ))}
        </ul>

        <button
          className="cursor-pointer mr-5 ml-5 px-5 py-2 rounded-full text-white font-bold text-lg bg-[#C62828] active:translate-y-1 hover:-translate-y-0.5"
          onClick={() => {
            // Handle logout (custom logic or Firebase signOut)
            router.push("/login");
          }}
        >
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
