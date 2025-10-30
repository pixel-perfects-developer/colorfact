  "use client";
  import { useSelector } from "react-redux";
  import { useParams } from "next/navigation";
  import Image from "next/image";
  import { useEffect, useState } from "react";
  import { Swiper, SwiperSlide } from "swiper/react";
  import "swiper/css";
  import "swiper/css/navigation";
  import { useSwiper } from "@/lib/SwiperStates";
  import { CustomNextArrow, CustomPrevArrow } from "./CustomArrow";

  const ProductPage = () => {
    const { id } = useParams();
    const decodedSlug = decodeURIComponent(id);
    const outfitData = useSelector((state) => state.imageDetails.details || {});
    const outfitKeys = Object.keys(outfitData);
    const { swiperRef, handleSlideChange, swiperState } = useSwiper();

    // 🧩 Find current outfit
    const outfitName = outfitKeys.find(
      (key) =>
        key.toLowerCase().replace(/\s+/g, "-") ===
        decodedSlug.toLowerCase().replace(/\s+/g, "-")
    );
    const selectedOutfit = outfitData[outfitName] || {};

    // 🎯 Only categories with products
    const validCategories = Object.entries(selectedOutfit).filter(
      ([_, items]) => Array.isArray(items) && items.length > 0
    );

  const [activeTab, setActiveTab] = useState("All");

    const [arrowThreshold, setArrowThreshold] = useState(4); // default desktop

    // 🔄 Reset Swiper when category changes
    useEffect(() => {
      if (swiperRef.current && swiperRef.current.slideTo) {
        swiperRef.current.slideTo(0);
      }

    }, [activeTab]);

    // 📏 Responsive arrow visibility threshold
    useEffect(() => {
      const handleResize = () => {
        const width = window.innerWidth;
        if (width < 640) setArrowThreshold(1); // Mobile
        else if (width < 1024) setArrowThreshold(2); // Tablet
        else setArrowThreshold(4); // Desktop
      };
      handleResize(); // run on mount
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!outfitName) {
      return (
        <div className="flex justify-center items-center min-h-[70vh] bg-[#faf5e7]">
          <p className="text-gray-500 text-lg">
            Outfit not found. Please go back to recommendations.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-[#faf5e7] min-h-screen">
        <div className="container-global">
          {/* 🧢 Title */}
          <h2 className="mb-8 text-center text-gray-800">{outfitName}</h2>

          {/* 🟠 Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={() => setActiveTab("All")}
              className={`${
                activeTab === "All" ? "btn-orange" : "btn-white"
              } border-none translate-y-0 !text-[0.8rem] !px-3 !py-1.5 flex items-center gap-1 whitespace-nowrap`}
            >
              All
            </button>

            {validCategories.map(([category]) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`${
                  activeTab === category ? "btn-orange" : "btn-white"
                } border-none translate-y-0 !text-[0.8rem] !px-3 !py-1.5 flex items-center gap-1 whitespace-nowrap`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 🧭 Product Swiper */}
          <div className="flex justify-center items-center gap-x-[2%] w-[90%] mx-auto md:w-full">
            {(() => {
              const allItems =
                activeTab === "All"
                  ? validCategories.flatMap(([_, items]) => items)
                  : validCategories.find(([cat]) => cat === activeTab)?.[1] || [];
              const totalItems = allItems.length;

              return (
                <>
                  {/* Show arrows based on device type */}
                  {totalItems > arrowThreshold && (
                    <CustomPrevArrow
                      swiperRef={swiperRef}
                      disabled={swiperState?.isBeginning}
                    />
                  )}

                  <div className={`${totalItems > arrowThreshold ? "w-[90%]" : "w-full"}`}>
                    <Swiper
                      onSwiper={(swiper) => (swiperRef.current = swiper)}
                      onSlideChange={handleSlideChange}
                      spaceBetween={20}
                      loop={false}    // ✅ only show grab cursor if items exceed threshold
                      allowTouchMove={true}
                      slidesPerView={1} // base case for mobile
                      breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 4 },
                      }}
                    >
                      {allItems.map((item, index) => (
                        <SwiperSlide key={index}>
<SwiperSlide key={index}>
  <div
    className={`${
      totalItems > arrowThreshold ? "cursor-grab" : "cursor-default"
    } bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between h-[420px] w-[90%] mx-auto md:w-full`}
  >
    {/* 🖼 Image */}
    <div className="relative w-full h-[200px] rounded-md overflow-hidden bg-gray-100">
      <Image
        src={item.product_id || "/placeholder.jpg"}
        alt={item.name || "Product"}
        fill
        className="object-cover transition-transform duration-500 hover:scale-105"
      />
    </div>

    {/* 📄 Product Info */}
    <div className="flex flex-col justify-between mt-4 flex-1">
      <div>
        <h4 className="text-[0.95rem] font-semibold text-gray-900 uppercase mb-1">
          {item.name || "CHEMISE À IMPRIMÉ ABSTRAIT"}
        </h4>

        <p className="text-gray-900 font-semibold text-[1rem] mb-1">
          €{item.price ? parseFloat(item.price).toFixed(2) : "99"}
        </p>

        <p className="text-gray-400 text-xs mb-2">
          Prix TTC, toutes taxes comprises
        </p>

        <p className="text-gray-600 text-sm leading-snug line-clamp-2">
          {item.description ||
            "Chemise à coupe décontractée. Col camp et manches courtes. Fermeture boutonnée à l’avant."}
        </p>
      </div>

      <button
        className="mt-4 bg-[#0D1320] text-white text-sm font-medium py-2 rounded-md hover:bg-[#1c263b] transition-colors w-full"
        onClick={() =>
          alert(`Buying ${item.name || "this product"}!`)
        }
      >
        Buy
      </button>
    </div>
  </div>
</SwiperSlide>

                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>

                  {totalItems > arrowThreshold && (
                    <CustomNextArrow
                      swiperRef={swiperRef}
                      disabled={swiperState?.isEnd}
                    />
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>
    );
  };

  export default ProductPage;
