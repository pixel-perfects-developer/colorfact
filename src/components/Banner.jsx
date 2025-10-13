"use client"
import { useFadeNavigation } from "@/lib/UseFadeNavigationHook";
import Image from "next/image";

const Banner = () => {
  const { sectionRef, handleNavigation } = useFadeNavigation();

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[#FFFFFF]"
    >
      {/* 🎥 Vidéo d’arrière-plan */}
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

      {/* 🌫️ Dégradé blanc superposé */}
<div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-transparent"></div>

      {/* ✨ Contenu centré */}
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

        {/* 🖋️ Slogan */}
        <h1 className="text-[#333333] font-poppins font-semibold tracking-tight mb-[6%]">
          Servir l’Harmonie
        </h1>

        {/* 🧩 Boutons d’appel à l’action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            className="btn-orange"
            onClick={() => handleNavigation("/upload-image")}
          >
            Importer un Article
          </button>

          <button
            className="btn-orange-outline"
            onClick={() => handleNavigation("/palette")}
          >
            Choisir une Couleur
          </button>
        </div>
      </div>
    </section>
  );
};

export default Banner;
