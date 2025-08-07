"use client";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // optional: install lucide-react
import YouTubePlayer from "@/src/components/YouTubePlayer";

const images = [
  "events4.jpg",
  "events5.jpg",
  "events6.jpeg",
];

const ImageSlider = () => {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000); // auto-switch every 3 sec

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => setIndex((index + 1) % images.length);
  const handlePrev = () =>
    setIndex((index - 1 + images.length) % images.length);

  return (
    <>
      <nav className="bg-[#afdeff]">
        <img src="/logo.svg" width="150" alt="Logo" className="p-4" />
      </nav>
      <div className="flex flex-col items-center p-10 justify-start h-[150vh] w-[100vw] bg-[#e4f4ff]">
        <div
          className="flex items-center justify-center relative w-[70vw] h-[50vh] overflow-hidden rounded-xl group"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Slide Container */}
          <div
            className="w-full h-full flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Slide ${i}`}
                className="w-full flex-shrink-0 object-cover h-full bg-cover"
              />
            ))}
          </div>

          {/* Prev Button */}
          <button
            onClick={handlePrev}
            className={`absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full transition-opacity duration-300 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <ChevronLeft />
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className={`absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full transition-opacity duration-300 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <ChevronRight />
          </button>
        </div>
        <button className="mt-7 p-5 bg-[#2f3383] rounded-full text-white font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform duration-300"
        onClick={() => window.location.href = "/login"}>
          Get Started
        </button>
        <div className="p-10">
          <YouTubePlayer videoUrl="https://youtu.be/uWBMBxWax0E" />
        </div>
        <h1 className="mt-16 text-5xl font-bold text-[#179eff] text-center animate-pulse">
          Our Councils And Committee's
        </h1>
      </div>
    </>
  );
};

export default ImageSlider;
