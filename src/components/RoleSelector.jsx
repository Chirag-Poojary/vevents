"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
  import { ToastContainer, toast } from 'react-toastify';
const roles = [
  { label: "Principal", value: "principal" },
  { label: "HOD", value: "hod" },
  { label: "Committee Head", value: "committee" },
  { label: "Accounts", value: "accounts" },
];

const RoleSelector = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        router.push("/login"); // redirect if not logged in
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!selectedRole) return;

    try {
      const res = await axios.post("/api/verify-role", {
        email: userEmail,
        role: selectedRole,
      });

      if (res.data.success) {
        toast.success("User Type Matched!", {
          position: "bottom-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        router.push(`/dashboard/${selectedRole}/PendingProposals`);
      } else {
        router.push("/unauthorized");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unauthorized User", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <div className="w-[50vw] p-15 mt-10 rounded-2xl shadow-lg bg-[#ceebff] text-center space-y-6">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <h2 className="text-3xl font-bold text-[#1A1F71]">Select Your Role</h2>

      <div className="grid grid-cols-2 gap-4">
        {roles.map((role) => (
          <button
            key={role.value}
            onClick={() => setSelectedRole(role.value)}
            className={`py-3 px-6 rounded-full text-white font-semibold transition duration-300
                ${
                  selectedRole === role.value
                    ? "bg-green-700"
                    : "bg-green-500 hover:bg-green-600"
                }
              `}
          >
            {role.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedRole}
        className="mt-4 bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Continue
      </button>
    </div>
  );
};

export default RoleSelector;
