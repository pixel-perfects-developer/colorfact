"use client";
import { useFadeNavigation } from "@/lib/UseFadeNavigationHook";
import Image from "next/image";
import { Upload, Palette } from "lucide-react"; // 🆕 icons

const Banner = () => {
  const { sectionRef, handleNavigation } = useFadeNavigation();

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[#FFFFFF]"
    >
      {/* 🎥 Background Video or Image */}
      <div className="absolute inset-0">
        <video
          className="hidden lg:block w-full h-full object-cover"
          src="/Fond_home_page.mov"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="lg:hidden w-full h-full bg-[url('/banner-bg.png')] bg-cover bg-center"></div>
      </div>

      {/* 🌫️ White Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-transparent"></div>

      {/* ✨ Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 lg:px-12">
        {/* 🟢 Logo */}
        <Image
          src="/colorfact logo.png"
          alt="ColorFact Logo"
          width={220}
          height={80}
          priority
          className="object-contain w-[150px] md:w-[200px] lg:w-[220px] mb-6"
        />

        {/* ❌ Removed “Servir l’Harmonie” (as per client) */}
        {/* ✅ Keep same spacing below logo */}
        <div className="mb-[6%]" />

        {/* 🧩 CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
          {/* 🔸 First button */}
          <button
            onClick={() => handleNavigation("/televerser-image")}
className="btn-orange"          >
            <Upload className="w-5 h-5" />
            Importer un Article
          </button>

          {/* 🔸 Second button */}
          <button 
            onClick={() => handleNavigation("/palette-de-couleurs")}
className="btn-orange"          >
            <Palette className="w-5 h-5" />
            Choisir une Couleur
          </button>
        </div>
      </div>
    </section>
  );
};

export default Banner;
