import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className="sticky top-0 bg-[#FFF3F3] w-full  z-[3000] py-[2%] lg:py-[0.5%]">
      <div className="container-global flex justify-between py-0 px-0 items-center">
        <div className="w-[30%] md:w-[20%] lg:w-[10%]">
          <Image
            src="/colorfact logo.png"
            alt="header-logo"
            priority 
            width={200} height={200}
          />
        </div>
<div className="flex justify-between  xl:w-[20%] 2xl:w-[15%] lg:w-[30%] gap-x-[1rem] lg:gap-x-0">
<Link href={"/"}>Accueil</Link>
<Link href={"/a-propos"}>À propos</Link>
<Link href={"/contact"}>Contact</Link>
</div>

      </div>
    </header>
  );
};

export default Header;
