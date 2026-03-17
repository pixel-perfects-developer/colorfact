import React from "react";
import TrendingTabs from "./TrendingTabs";

const Trending = () => {
  return (
    <section className="bg-[#F9F3E9]">
      <div className="container-global  flex flex-col items-center justify-center min-h-[calc(100vh-264.61px)] md:min-h-[calc(100vh-237.27px)] lg:min-h-[calc(100vh-130px)] xl:min-h-[calc(100vh-147.09px)]  2xl:min-h-[calc(100vh-163px)]">
        <h1>Tendances</h1>
        <TrendingTabs />
      </div>
    </section>

  );
};

export default Trending;
