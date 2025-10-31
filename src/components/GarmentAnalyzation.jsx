import Image from "next/image";
import Link from "next/link";
import React from "react";

const GarmentAnalyzation = ({ selectedGarment }) => {
  return (
    <div className="container-global">
      <div className="container-global lg:w-[70%] mx-auto">
        <div className="flex justify-center">
          <Image
            src={"/shirt.png"}
            alt="vêtement analysé"
            width={400}
            height={400}
            className="w-[80%] lg:w-[30%]"
          />
        </div>

        <div className="text-center mt-[2%]">
          <h2>{selectedGarment || "T-shirt Baseball Thérapie d’Entreprise"}</h2>

          <p className="my-[1%]">
            <data value="59.99">€40.00</data>
          </p>

          <p>100 % coton / Logo imprimé sur le devant</p>
          <p className="my-[1%]">MENTALITÉ FINESSE</p>

          <div className="mt-[2rem] lg:mt-[2%]">
            <Link className="btn-purple" href={"/articles-assortis/chemise-bleue-décontractée"}>
              Lien du produit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GarmentAnalyzation;
