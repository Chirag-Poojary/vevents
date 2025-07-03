"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const res = await fetch("/api/get-role", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user.email }),
          });

          const data = await res.json();
          if (data.success && data.role) {
            setRole(data.role.toLowerCase());
          } else {
            console.warn("No role found for user");
          }
        } catch (err) {
          console.error("Error fetching user role:", err);
        }
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const navItems = [
    {
      label: (
        <>
          Pending <br /> Proposals
        </>
      ),
      path: role ? `/dashboard/${role}/PendingProposals` : "#",
    },
    {
      label: (
        <>
          Proposals <br /> Status
        </>
      ),
      path: role ? `/dashboard/${role}/ProposalStatus` : "#",
    },
  ];

  if (!role) {
    return (
      <nav className="p-4 bg-[#afdeff] text-center font-bold">
        Loading role-based menu...
      </nav>
    );
  }

  return (
    <nav className="p-2 bg-[#afdeff] flex items-center justify-between w-[100vw]">
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
          onClick={async () => {
            const auth = getAuth();
            await auth.signOut();
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
