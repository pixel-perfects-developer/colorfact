import React from "react";
import TrendingTabs from "./TrendingTabs";

const Trending = () => {
  return (
    <section className="bg-[#F9F3E9]">
    <div  className="container-global lg:w-[58%]  flex flex-col items-center justify-center min-h-[calc(100vh-264.61px)] md:min-h-[calc(100vh-237.27px)] lg:min-h-[calc(100vh-130px)] xl:min-h-[calc(100vh-147.09px)]  2xl:min-h-[calc(100vh-163px)]">
        <h1>Tendances</h1>
        <p className="text-center mt-[1%]">
          Descubre las últimas tendencias que marcan el mundo de la moda y el
          estilo. Inspiraciones, novedades, ideas y selecciones exclusivas para
          acompañarte en cada momento especial, con una mirada moderna y
          sofisticada hacia lo que define la temporada. Desde piezas
          imprescindibles hasta nuevas propuestas creativas, aquí encontrarás
          todo lo necesario para mantenerte a la vanguardia.
        </p>
        <TrendingTabs/>
    </div>
    </section>

  );
};

export default Trending;
