"use client";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react"; // ✅ Lucide icons

const ProductPage = () => {
  const { id } = useParams();
  const decodedSlug = decodeURIComponent(id);
  const outfitData = useSelector((state) => state.imageDetails.details || {});
  const outfitKeys = Object.keys(outfitData);

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

  const [activeTab, setActiveTab] = useState(
    validCategories.length > 0 ? validCategories[0][0] : ""
  );

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
    <div className="bg-[#faf5e7] min-h-[80vh] py-10">
      <div className="container-global">
        {/* 🧢 Title */}
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          {outfitName}
        </h2>

        {/* 🟠 Custom Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {validCategories.map(([category]) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-6 py-2 text-sm md:text-base font-semibold rounded-full transition-all duration-300 ${
                activeTab === category
                  ? "bg-[#F16935] text-white shadow-md scale-105"
                  : "bg-white text-gray-700 hover:bg-[#f2ede4]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 🧭 Custom Swiper Navigation Buttons */}
        <div className="flex justify-center items-center gap-x-[2%]">
          <div
            className="swiper-button-prev-custom cursor-pointer z-10 bg-[#F16935] text-white rounded-full w-10 h-10 flex items-center justify-center hover:scale-105 transition"
          >
           <ChevronLeft/>
          </div>
        

          {/* 🧺 Swiper Content */}
          <div className="w-[90%]">
          {validCategories.map(([category, items]) => (
            <div
              key={category}
              style={{ display: activeTab === category ? "block" : "none" }}
            >
              <Swiper
                modules={[Navigation]}
                navigation={{
                  prevEl: ".swiper-button-prev-custom",
                  nextEl: ".swiper-button-next-custom",
                }}
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 4 },
                }}
              >
                {items.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all">
                      {item.product_id && (
                        <div className="relative w-full h-64 mb-3">
                          <Image
                            src={item.product_id || "/placeholder.jpg"}
                            alt={item.name || "Product"}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                      {/* <h4 className="font-medium text-gray-800 text-center">
                        {item.name || "Unnamed Product"}
                      </h4>
                      {item.price && (
                        <p className="text-gray-600 text-sm text-center">
                          €{item.price}
                        </p>
                      )} */}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ))}
          </div>
  <div
            className="swiper-button-next-custom cursor-pointer z-10 bg-[#F16935] text-white rounded-full w-10 h-10 flex items-center justify-center hover:scale-105 transition"
          >
           <ChevronRight/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
