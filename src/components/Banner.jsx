"use client";
import { useFadeNavigation } from "@/lib/UseFadeNavigationHook";
import { Upload, Palette } from "lucide-react"; // 🆕 icons

const Banner = () => {
  const { sectionRef, handleNavigation } = useFadeNavigation();

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[calc(100vh-272px)] md:min-h-[calc(100vh-237.27px)] lg:min-h-[calc(100vh-130px)] xl:min-h-[calc(100vh-147.09px)]  2xl:min-h-[calc(100vh-163px)] flex flex-col justify-center items-center overflow-hidden bg-[#FFFFFF]"
    >
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          className="hidden md:block w-full min-h-screen object-cover"
          src="/BannerDesktop.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <video
          className="block md:hidden w-full min-h-screen object-cover"
          src="/BannerMobile.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* White Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">

        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center w-full">
          <button onClick={() => handleNavigation("/image-search")} className="btn-orange items-center flex justify-center gap-x-[4%] w-[16rem] lg:w-[16vw] py-[1rem] lg:py-[3%] 2xl:w-[13rem]">
            <Upload className="w-5 h-5 lg:w-[0.85vw] lg:h-[0.85vw] 2xl:w-[0.85rem] 2xl:h-[0.85rem]" />
            Importer un Article
          </button>

          <button onClick={() => handleNavigation("/color-search")} className="btn-orange items-center flex justify-center gap-x-[4%] w-[16rem] lg:w-[16vw] py-[1rem] lg:py-[3%]  2xl:w-[13rem]">
            <Palette className="w-5 h-5 lg:w-[0.85vw] lg:h-[0.85vw] 2xl:w-[0.85rem] 2xl:h-[0.85rem]" />
            Choisir une Couleur
          </button>
        </div>
      </div>
    </section>

  );
};

export default Banner;
