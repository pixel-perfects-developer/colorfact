import { Upload, Palette } from "lucide-react"; // 🆕 icons
import Link from "next/link";

const Banner = () => {

  return (
    <section
      className="relative w-full min-h-[calc(100vh-17rem)]  lg:min-h-[calc(100vh-18vh)] flex flex-col justify-center items-center overflow-hidden bg-[#FFFFFF]"
    >
      {/* Background Video */}
      <div className="absolute inset-0 ">
       <video
          className="hidden md:block  h-[85vh] object-cover w-full object-center"

          src="/BannerDesktop.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <video
          className="block md:hidden w-full  h-[calc(100vh-272px)] md:min-h-[calc(100vh-237.27px)]  object-cover"
          src="/BannerMobile.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
{/*  */}
      {/* Content */}
      <div className="relative z-10 hidden md:flex flex-col items-center text-center">

        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center w-full">
          <Link
            href={"/image-search"}
            className="btn-orange flex items-center gap-x-[4%]   rounded-xl text-[1rem] lg:text-[0.8vw] px-[5%] py-[3%] justify-center whitespace-nowrap"
          >
            <Upload className="size-[1.5rem] lg:size-[1.5vw] " />
            Importer un Article
          </Link>

          <Link
            href={"/color-search"}
            className="btn-orange flex items-center gap-x-[4%] rounded-xl text-[1rem] lg:text-[0.8vw] px-[5%]  py-[3%] justify-center whitespace-nowrap"
          >
            <Palette className="size-[1.5rem]  lg:size-[1.5vw] " />
            Choisir une Couleur
          </Link>
        </div>

      </div>
    </section>

  );
};

export default Banner;