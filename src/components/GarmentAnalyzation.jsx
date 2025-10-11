import Image from 'next/image'
import React from 'react'

const GarmentAnalyzation = ({selectedGarment}) => {
  return (
   <div className="container-global ">
      <div className="container-global  lg:w-[70%] mx-auto">
        <div className="flex justify-center">
            <Image
                src={"/shirt.png" }
                alt="uploaded-garment"
                width={400}
                height={400}
                className="w-[80%] lg:w-[30%]"
              />
        </div>
        <div className="text-center mt-[2%]">
        <h2>{selectedGarment|| "Baseball Tee Buisness Therapy"}</h2>
<p className="my-[1%]">
 <data value="59.99">€40.00</data>
</p>
<p>100% cotton / Screen print logo</p>
<p className="my-[1%]">FINESSE MENTALITY</p>
<button className="btn-purple mt-[1%]">Product Link</button>
        </div>

      </div>
    </div>
  )
}

export default GarmentAnalyzation
