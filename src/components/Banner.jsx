import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Banner = () => {
  return (
<div className="relative w-full h-[74vh] md:h-[80vh] lg:h-[82vh] bg-[url('/banner-bg.png')] bg-cover bg-[position:center_top] py-[2%] flex justify-center items-center flex-col gap-x-[1rem] lg:gap-x-[1%]">

  <div className="block lg:hidden absolute inset-0 bg-white/60"></div>
  <div className="relative z-10 flex flex-col items-center justify-center">
    <div className="flex lg:hidden mb-[1rem]">
      <Image
        src="/colorfact logo.png"
        alt="header-logo"
        priority
        width={200}
        height={200}
      />
    </div>

    <div className="flex justify-center items-center gap-x-[1rem] lg:gap-x-[4%] mt-[1rem] lg:mt-0">
     <Link href={"/upload-image"} >
    <button className="btn-slider lg:w-[10vw]">Télécharger une image</button> </Link> 
     <Link href={"#"} >
      <button className="btn-slider lg:w-[10vw]">Choisir une couleur</button></Link>
    </div>
  </div>
</div>


  )
}

export default Banner
