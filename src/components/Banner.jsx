"use client";
import { useFadeNavigation } from "@/lib/UseFadeNavigationHook";
import Image from "next/image";
import { Upload, Palette } from "lucide-react"; // 🆕 icons

const Banner = () => {
  const { sectionRef, handleNavigation } = useFadeNavigation();

  return (
  <section
  ref={sectionRef}
  className="relative w-full min-h-[calc(100vh-264.61px)] md:min-h-[calc(100vh-237.27px)] lg:min-h-[calc(100vh-130px)] xl:min-h-[calc(100vh-147.09px)]  2xl:min-h-[calc(100vh-163px)] flex flex-col justify-center items-center overflow-hidden bg-[#FFFFFF]"
>
  {/* Background Video */}
  <div className="absolute inset-0">
    <video
      className="hidden lg:block w-full min-h-screen object-cover"
      src="/Fond_home_page.mp4"
      autoPlay
      loop
      muted
      playsInline
    />
    <div className="lg:hidden w-full h-full bg-[url('/banner-bg.png')] bg-cover bg-center" />
  </div>

  {/* White Gradient */}
  <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-transparent"></div>

  {/* Content */}
  <div className="relative z-10 flex flex-col items-center text-center px-6 lg:px-12">
    <div className="mb-[6%]" />

    <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
      <button onClick={() => handleNavigation("/image-search")} className="btn-orange">
        <Upload className="w-5 h-5" />
        Importer un Article
      </button>

      <button onClick={() => handleNavigation("/color-search")} className="btn-orange">
        <Palette className="w-5 h-5" />
        Choisir une Couleur
      </button>
    </div>
  </div>
</section>

  );
};

export default Banner;
