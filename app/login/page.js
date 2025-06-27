"use client";
import React, { useState } from "react";
import { auth, db } from "@/src/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import RoleSelector from "@/src/components/RoleSelector";

const Login = () => {
  const [showAbout, setShowAbout] = useState(false);

  const handleKnowMoreClick = () => {
    setShowAbout(!showAbout);
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user to Firestore (under users collection)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        timestamp: new Date().toISOString(),
      });

      alert("Login successful!");
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <>
      <nav className='bg-[#afdeff]'>
        <img src="/logo.svg" width="150" alt="Logo" className="p-4" />
      </nav>
      <div className="flex flex-col -z-2 bg-[#e4f4ff] items-center justify-between p-10 h-[93vh] w-[100vw]">
        <button
          onClick={handleLogin}
          className="py-5 px-7 rounded-full text-white font-bold text-xl bg-[#2E7D32] active:translate-y-1 hover:-translate-y-0.5"
        >
          Log In
        </button>
        <RoleSelector/>
        <img src="/vit.png" width="1100" className="mt-10 opacity-15" />
        <div className="relative w-[80vw] h-[20vh]">
          <button
            className="absolute bottom-5 hover:font-bold active:font-bold z-10 text-[#C62828]"
            onClick={handleKnowMoreClick}
          >
            Know more...
          </button>
          {showAbout && (
            <div className="absolute bottom-10 left-0 w-full bg-transparent p-5 h-[22vh] overflow-y-auto z-20">
              <p className="text-sm text-gray-800">
                <b>Welcome to the official Events Page of Vidyalankar Institute of
                Technology!</b>
                <br />
                This platform is built to streamline the entire event management
                experience within the institute. Our goal is to create a clean and
                efficient <b>Event Flow System</b> that not only informs but also
                simplifies how events are proposed, reviewed, and approved.
                <br />
                Through this system, students or coordinators can initiate an
                event proposal by filling out a structured digital form that
                includes event details, budget (if applicable), department, venue
                requirements, and other relevant information.
                <br />
                Once submitted, the proposal is automatically routed to the
                appropriate authorities in a <b>Hierarchical approval
                chain</b>—starting with the <b>Head of Department (HOD)</b>, and finally reaching the <b>Principal or Accounts Department</b> (if budget is involved).
                Each stage allows for transparent acceptance or rejection with
                remarks, ensuring full accountability.
                <br />
                This structured digital flow guarantees that events are reviewed
                efficiently, reducing manual delays and miscommunication. It
                ensures that only well-vetted events take place, fostering
                professionalism and smoother campus operations. 
                <br/>
                Stay tuned and be a part of the vibrant VIT community!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;

