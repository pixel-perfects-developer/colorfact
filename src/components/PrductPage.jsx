"use client";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useSwiper } from "@/lib/SwiperStates";
import { CustomNextArrow, CustomPrevArrow } from "@/components/CustomArrow";
import { useState, useEffect } from "react";

const ProductPage = () => {
  const { id } = useParams();
  const decodedSlug = decodeURIComponent(id).toLowerCase();

  const router = useRouter();
  const { swiperRef, handleSlideChange, swiperState } = useSwiper();

  // 🧩 Both possible data sources
  const outfitData = useSelector((state) => state.imageDetails.details || {});
  const apiOutfitData = useSelector((state) => state.outfitRecommendation.outfits || {});

  const [products, setProducts] = useState([]);

  // 🔄 Combine logic: decide which data source to use
  useEffect(() => {
    if (apiOutfitData?.recommendations?.length > 0) {
      // ✅ From AI recommendation API
      const filtered = apiOutfitData.recommendations.filter(
        (item) =>
          item["Catégorie produit"]?.toLowerCase().replace(/\s+/g, "-") === decodedSlug
      );
      setProducts(filtered);
    } else if (outfitData && Object.keys(outfitData).length > 0) {
      // ✅ From extracted outfitData
      const matchedKey = Object.keys(outfitData).find(
        (key) => key.toLowerCase().replace(/\s+/g, "-") === decodedSlug
      );
      if (matchedKey) {
        const categoryProducts = Object.values(outfitData[matchedKey])
          .flat()
          .filter((item) => item?.product_id);
        setProducts(categoryProducts);
      }
    }
  }, [decodedSlug, outfitData, apiOutfitData]);

  // 📏 Responsive arrow threshold
  const [arrowThreshold, setArrowThreshold] = useState(4);
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setArrowThreshold(1);
      else if (width < 1024) setArrowThreshold(2);
      else setArrowThreshold(4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!products?.length) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#faf5e7]">
        <p className="text-gray-500 text-lg">
          Aucun produit trouvé pour cette catégorie.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#faf5e7] min-h-screen py-10">
      <div className="container-global">
        <h2 className="mb-8 text-center text-2xl font-semibold text-gray-800 capitalize">
          {decodedSlug.replace(/-/g, " ")}
        </h2>

        <div className="flex justify-center items-center gap-x-[2%] w-[90%] mx-auto md:w-full">
          {(() => {
            const totalItems = products.length;

            return (
              <>
                {totalItems > arrowThreshold && (
                  <CustomPrevArrow
                    swiperRef={swiperRef}
                    disabled={swiperState?.isBeginning}
                  />
                )}

                <div
                  className={`${
                    totalItems > arrowThreshold ? "w-[90%]" : "w-full"
                  }`}
                >
                  <Swiper
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    onSlideChange={handleSlideChange}
                    spaceBetween={20}
                    loop={false}
                    allowTouchMove={true}
                    slidesPerView={1}
                    breakpoints={{
                      640: { slidesPerView: 2 },
                      1024: { slidesPerView: 4 },
                    }}
                  >
                    {products.map((item, index) => (
                      <SwiperSlide key={index}>
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between h-[420px] w-[90%] mx-auto md:w-full">
                          {/* 🖼 Image */}
                     <div className="relative w-full h-[240px] rounded-t-md overflow-hidden bg-gray-100 flex items-center justify-center">
    <Image
      src={
        item["Photo produit 1"] ||
        item.product_id ||
        "/placeholder.jpg"
      }
      alt={item["Nom produit"] || item.name || "Product"}
      fill
      className="object-contain p-2 transition-transform duration-500 hover:scale-105"
    />
  </div>


                          {/* 📄 Product Info */}
                          <div className="flex flex-col justify-between mt-4 flex-1">
                            <div>
                              <h4 className="text-[0.95rem] font-semibold text-gray-900 uppercase mb-1">
                                {item["Nom produit"] || item.name || "Produit"}
                              </h4>

                              <p className="text-gray-900 font-semibold text-[1rem] mb-1">
                                €
                                {item.Prix ||
                                  item.price ||
                                  "—"}
                              </p>

                              <p className="text-gray-400 text-xs mb-2">
                                Prix TTC, toutes taxes comprises
                              </p>
                            </div>

                            <a
                              href={item["Lien achat"] || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 bg-[#0D1320] text-white text-sm font-medium py-2 rounded-md hover:bg-[#1c263b] transition-colors w-full text-center"
                            >
                              Acheter
                            </a>
                          </div>
                        </div>
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
