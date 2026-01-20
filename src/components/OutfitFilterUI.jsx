"use client";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowRight, SlidersHorizontal, X } from "lucide-react";
import { setOutfits } from "@/redux/slices/outfitRecommendationSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { getOutfitRecommendation } from "@/api/outfit_recommendation";
import * as Slider from "@radix-ui/react-slider";

const adjustColor = (hex, percent = 50) => {
  if (typeof hex === "object" && hex?.hex) {
    hex = hex.hex; // extract #abc123
  }

  if (Array.isArray(hex)) {
    hex = hex[0]; // extract first element
  }

  if (typeof hex !== "string") {
    hex = String(hex || ""); // convert number/null/undefined → ""
  }

  hex = hex.trim().toUpperCase();

  // If rgb(), skip adjustment
  if (hex.startsWith("RGB")) return hex;

  // Ensure #
  if (!hex.startsWith("#")) hex = "#" + hex.replace(/^#*/, "");

  // Expand #ABC → #AABBCC
  if (/^#([A-F0-9]{3})$/.test(hex)) {
    hex =
      "#" +
      hex
        .slice(1)
        .split("")
        .map((c) => c + c)
        .join("");
  }

  // If still invalid → skip and return original
  if (!/^#[A-F0-9]{6}$/.test(hex)) {
    console.warn("❌ Invalid HEX passed to adjustColor:", hex);
    return "#000000"; // fallback
  }
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;
  let l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  l += (percent - 50) / 100;
  l = Math.max(0, Math.min(1, l));

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  r = hue2rgb(p, q, h + 1 / 3);
  g = hue2rgb(p, q, h);
  b = hue2rgb(p, q, h - 1 / 3);

  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(
    b * 255
  )})`;
};

const OutfitFilterPage = () => {
  const outfitData = useSelector((state) => state.imageDetails.details || {});
 console.log("outf",outfitData);
 
const apiOutfitData = useSelector(
  (state) => state.outfitRecommendation.outfits || {}
);
  const outfitKeys = Object.keys(outfitData);

const recommendations = apiOutfitData?.recommendations || [];

const hasRecommendations =
  Array.isArray(recommendations) && recommendations.length > 0;

const categoriesFromRecommendations = Array.from(
  new Set(
    recommendations
      .map((item) => item.category)
      .filter(Boolean)
  )
).map((cat) => ({ name: cat }));

const brandsFromRecommendations = Array.from(
  new Set(
    recommendations
      .map((item) => item.brand)
      .filter(Boolean)
  )
).map((b) => ({ name: b }));

const fallbackCategories = outfitKeys.map((key) => ({ name: key }));

const categoryFilterData = hasRecommendations
  ? categoriesFromRecommendations
  : fallbackCategories;

  console.log("ou",outfitKeys);
  
  const dispatch = useDispatch();
  const router = useRouter();

  const colorData = useSelector((state) => state.color?.colors);

  const colors = Array.isArray(colorData)
    ? colorData.map((c) => ({ hex: c }))
    : colorData
      ? [{ hex: colorData }]
      : [];

  const [openSection, setOpenSection] = useState("color");
  const [showFilters, setShowFilters] = useState(false);
  const [colorIntensity, setColorIntensity] = useState(colors.map(() => 50));
  const [loading, setLoading] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);

  const [tempFilters, setTempFilters] = useState({
    colors: [],
    category: "",
    brands: [],
    avoid: [],
    minPrice: 0,
    maxPrice: 1000,
  });

  useEffect(() => {
    document.body.style.overflow = showFilters ? "hidden" : "auto";
  }, [showFilters]);

  const toggleSection = (id) => setOpenSection(openSection === id ? null : id);

  const handleCheckbox = (type, name, checked, extra = null) => {
    setFiltersApplied(false);
    setTempFilters((prev) => {
      let updated = [...prev[type]];
      if (extra && "min" in extra && "max" in extra) {
        if (checked) updated.push(extra);
        else updated = updated.filter((item) => item.min !== extra.min);
      } else {
        if (checked) updated.push(name);
        else updated = updated.filter((item) => item !== name);
      }
      return { ...prev, [type]: updated };
    });
  };

  const resetFilters = () => {
    setTempFilters({
      colors: [],
      category: "",
      brands: [],
      avoid: [],
      minPrice: 0,
      maxPrice: 1000,
    });
    setColorIntensity(colors.map(() => 50));
    setOpenSection(null);
    setFiltersApplied(false);
    dispatch(setOutfits({}));
  };
  const selectedType = tempFilters.category;

  const applyFilters = async () => {
    try {
      // if (!tempFilters.category) {
      //   toast.error("Veuillez sélectionner au moins une catégorie.", {
      //     position: "top-center",
      //   });
      //   return;
      // }

      setLoading(true);

      // Adjust colors with intensity
      const adjustedColors =
        Array.isArray(colorData) && colorData.length
          ? colorData
            .map((c, i) => {
              let hexValue = typeof c === "object" && c.hex ? c.hex : c;

              // ✅ Ensure starts with #
              if (!hexValue.startsWith("#")) {
                hexValue = "#" + hexValue.replace(/^#*/, "");
              }

              // ✅ Normalize shorthand (#ABC → #AABBCC)
              if (/^#([A-Fa-f0-9]{3})$/.test(hexValue)) {
                hexValue =
                  "#" +
                  hexValue
                    .slice(1)
                    .split("")
                    .map((ch) => ch + ch)
                    .join("");
              }

              // ✅ Uppercase + length check
              hexValue = hexValue.toUpperCase();
              if (!/^#[A-F0-9]{6}$/.test(hexValue)) {
                console.warn("Skipping invalid color:", hexValue);
                return null;
              }

              return hexValue;
            })
            .filter(Boolean)
          : [];

      // ✅ Call the helper function directly (no more /api call)
      const data = await getOutfitRecommendation({
        inputColors: adjustedColors,
        type: selectedType,
        minPrice: tempFilters.minPrice,
        maxPrice: tempFilters.maxPrice,
        wantedBrands: tempFilters.brands,
        removedBrands: tempFilters.avoid,
      });
      setShowFilters(false)
      if (data.error) {
        throw new Error(data.error);
      }

      // ✅ Update Redux
      dispatch(setOutfits(data));

      setFiltersApplied(true);
      console.log("✅ Filtered outfit data:", data);
    } catch (err) {
      console.error("❌ API error:", err);
      toast.error("Une erreur s'est produite. Veuillez réessayer.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const rgbToHex = (rgb) => {
    const result = rgb.match(/\d+/g);
    if (!result) return rgb;
    return (
      "#" +
      result
        .map((num) => {
          const hex = parseInt(num).toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
        .toUpperCase()
    );
  };

  const renderFilterSections = () => (
    <>
      {[
        { id: "color", title: "Couleur", data: colors },
        {
          id: "category",
          title: "Catégorie",
  data: categoryFilterData,
        },
    ...(brandsFromRecommendations.length > 0
    ? [
        {
          id: "brands",
          title: "Marques",
          data: brandsFromRecommendations,
        },
      ]
    : []),
        // {
        //   id: "avoid",
        //   title: "Marques à éviter",
        //   data: [{ name: "Gucci" }, { name: "Balenciaga" }],
        // },
        { id: "price", title: "Prix", data: [] },
      ].map((section) => (
        <div key={section.id} className="border-b border-gray-200 py-[4%] select-none">
          <div
            onClick={() => toggleSection(section.id)}
            className={`flex items-center justify-between cursor-pointer mb-[2%]`}
          >
            <h5 className="font-bold">{section.title}</h5>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 ml-2 text-gray-600 transition-transform duration-300 ${openSection === section.id ? "rotate-180" : "rotate-0"}
                }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${openSection === section.id
                ? "max-h-[500px] opacity-100"
                : "max-h-0 opacity-0"
              }`}
          >
            {section.id === "color" &&
              section.data.map((c, i) => {
                const adjusted = adjustColor(c.hex, colorIntensity[i]);
                const isOn = colorIntensity[i] > 0;

                return (
                  <div key={i} className="mb-[4%]">
                    {/* LABEL + TOGGLE */}
                    <div className="flex justify-between items-center mb-2">
                      <p className={`font-medium ${!isOn ? "opacity-40" : "text-gray-800"}`}>
                        Intensité de la couleur
                      </p>

                      {/* iPhone style toggle */}
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={isOn}
                          onChange={(e) => {
                            const enable = e.target.checked;
                            const newVal = enable ? 50 : 0;

                            setColorIntensity((prev) =>
                              prev.map((v, idx) => (idx === i ? newVal : v))
                            );

                            handleCheckbox("colors", c.hex, enable);
                          }}
                          className="sr-only peer"
                        />

                        {/* Toggle track */}
                        <div
                          className="
                w-12 h-6 bg-gray-300 rounded-full
                transition-all duration-300 ease-out
                peer-checked:bg-[#F16935] relative
              "
                        >
                          {/* Toggle circle */}
                          <div
                            className={`
    absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow
    transition-transform duration-300 ease-in-out
    ${isOn ? "translate-x-6" : "translate-x-0"}
  `}
                          />

                        </div>
                      </label>
                    </div>

                    {/* COLOR DOT + SLIDER */}
                    <div className="flex gap-3">
                      {/* Dot + HEX */}
                      <div className="flex flex-col items-center w-12 select-none">
                        <div
                          className={`w-5 h-5 rounded-full border shadow-sm mb-1 transition-all ${!isOn ? "opacity-30" : ""
                            }`}
                          style={{ backgroundColor: adjusted }}
                        ></div>

                        <span className={`text-[10px] font-medium ${!isOn ? "opacity-30" : ""}`}>
                          {rgbToHex(adjusted)}
                        </span>
                      </div>

                      {/* Slider */}
                      <Slider.Root
                        className={`relative flex items-center w-full h-8 ${!isOn ? "opacity-30 pointer-events-none" : ""
                          }`}
                        min={0}
                        max={100}
                        step={1}
                        value={[isOn ? colorIntensity[i] : 0]} // 🔥 ensures thumb stays LEFT on OFF
                        onValueChange={(values) => {
                          const v = values[0];

                          setColorIntensity((prev) =>
                            prev.map((x, idx) => (idx === i ? v : x))
                          );

                          if (!tempFilters.colors.includes(c.hex)) {
                            handleCheckbox("colors", c.hex, true);
                          }
                        }}
                      >
                        <Slider.Track
                          className="relative grow rounded-full h-[10px]"
                          style={{
                            background: `linear-gradient(to right, ${c.hex} 0%, ${adjusted} 100%)`,
                          }}
                        >
                          <Slider.Range className="absolute bg-[#F16935] h-full rounded-full" />
                        </Slider.Track>

                        <Slider.Thumb
                          className="
                block w-6 h-6 bg-[#F16935] 
                outline outline-white outline-2 
                rounded-full shadow-lg 
                cursor-pointer hover:scale-125 
                transition-all
              "
                        />
                      </Slider.Root>
                    </div>
                  </div>
                );
              })}


            {section.id === "category" &&
              section.data.map((cat, i) => (
                <label
                  key={i}
                  className={`flex items-center gap-2 cursor-pointer p-1 rounded-md transition-colors`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={tempFilters.category === cat.name}
                    onChange={() => {
                      setTempFilters((prev) => ({
                        ...prev,
                        category:
                          prev.category === cat.name
                            ? ""
                            : cat.name,
                      }));
                    }}
                    className={`w-4 h-4 cursor-pointer transition-all duration-200
    ${tempFilters.category === cat.name ? "accent-[#F16935] font-bold" : "accent-gray-400 font-normal"
                      }
  `}
                  />

                  <h6 className={tempFilters.category === cat.name ? "accent-[#F16935] font-bold" : "accent-gray-400 font-normal"}>{cat.name}</h6>
                </label>
              ))}
              {brandsFromRecommendations.length>0 && (
                   section.id === "brands" &&
              section.data.map((b, i) => (
                <label
                  key={i}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={tempFilters.brands.includes(b.name)}
                    onChange={(e) =>
                      handleCheckbox("brands", b.name, e.target.checked)
                    }
                    className="accent-[#F16935]"
                  />
                  <h5>{b.name}</h5>
                </label>
              ))
              )}
         

            {section.id === "avoid" &&
              section.data.map((b, i) => (
                <label
                  key={i}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={tempFilters.avoid.includes(b.name)}
                    onChange={(e) =>
                      handleCheckbox("avoid", b.name, e.target.checked)
                    }
                    className="accent-[#F16935]"
                  />
                  <h5>{b.name}</h5>
                </label>
              ))}

            {section.id === "price" && openSection === "price" && (
              <div className="flex flex-col gap-3">
                <div>
                  <div className="flex justify-between gap-x-4">
                    {/* MIN PRICE */}
                    <div className="relative w-full">
                      <input
                        type="text"
                        min="0"
                        max="1000"
                        value={tempFilters.minPrice}
                        onChange={(e) => {
                          setFiltersApplied(false);
                          setTempFilters((prev) => ({
                            ...prev,
                            minPrice: Math.max(
                              0,
                              Math.min(1000, Number(e.target.value))
                            ),
                          }));
                        }}
                        className="border rounded-md p-2 w-full text-sm pr-6"
                        placeholder="0"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        €
                      </span>
                    </div>

                    {/* MAX PRICE */}
                    <div className="relative w-full">
                      <input
                        type="text"
                        min="0"
                        max="1000"
                        value={tempFilters.maxPrice}
                        onChange={(e) => {
                          setFiltersApplied(false);
                          setTempFilters((prev) => ({
                            ...prev,
                            maxPrice: Math.max(
                              0,
                              Math.min(1000, Number(e.target.value))
                            ),
                          }));
                        }}
                        className="border rounded-md p-2 w-full text-sm pr-6"
                        placeholder="0"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        €
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="px-2">
                    <Slider.Root
                      className="relative flex items-center select-none touch-none w-full h-5"
                      min={0}
                      max={1000}
                      step={5}
                      value={[tempFilters.minPrice, tempFilters.maxPrice]}
                      onValueChange={(values) => {
                        setFiltersApplied(false);
                        setTempFilters((prev) => ({
                          ...prev,
                          minPrice: values[0],
                          maxPrice: values[1],
                        }));
                      }}
                    >
                      {/* Track */}
                      <Slider.Track className="bg-gray-300 relative grow rounded-full h-[4px]">
                        {/* Highlighted Range */}
                        <Slider.Range className="absolute bg-[#F16935] h-full rounded-full" />
                      </Slider.Track>

                      {/* Left Thumb */}
                      <Slider.Thumb className="block w-4 h-4 bg-[#F16935] rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform" />

                      {/* Right Thumb */}
                      <Slider.Thumb className="block w-4 h-4 bg-[#F16935] rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform" />
                    </Slider.Root>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      <button
        disabled={ filtersApplied || loading}
        onClick={applyFilters}
        className={`w-full ${ filtersApplied || loading
            ? "btn-blue opacity-80 !cursor-not-allowed "
            : "btn-blue"
          } `}
      >
        {loading
          ? "Chargement..."
          : filtersApplied
            ? "Déjà appliqué "
            : "RECHERCHER"}
      </button>

      <button
        onClick={resetFilters}
        className="w-full bg-gray-300 text-gray-700 font-medium py-2 rounded-md mt-3 hover:bg-gray-400 transition-all"
      >
        Réinitialiser les filtres
      </button>
    </>
  );
  const filteredData = Object.entries(outfitData).filter(([_, categoryData]) => {
    return (
      categoryData &&
      Object.values(categoryData).some(
        (arr) => Array.isArray(arr) && arr.length > 0
      )
    );
  });

console.log("fil",filteredData);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-[#faf5e7] min-h-[calc(100vh-17rem)]  lg:min-h-[calc(100vh-18vh)] lg:pb-[2%]"
    >
      <div className="container-global py-0 flex flex-col items-start md:flex-row gap-x-[4%] 2xl:gap-x-[4%] relative">
        <button
          className="lg:hidden flex justify-end mb-4 "
          onClick={() => setShowFilters(true)}
        >
          <SlidersHorizontal size={30} />
        </button>

        <aside className="hidden lg:block md:w-[30%] 2xl:w-[20%] sticky top-30 mt-[2%]">
          <h4 className="mb-[2%] ">Filtres</h4>
          {renderFilterSections()}
        </aside>
        <div
          className={`lg:hidden fixed inset-0 z-[3001] transition-all duration-500 ease-in-out ${showFilters ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ease-in-out ${showFilters ? "opacity-100" : "opacity-0"
              }`}
            onClick={() => setShowFilters(false)}
          ></div>

          {/* Drawer Panel */}
          <div
            className={`absolute top-0 right-0 h-full w-[70%] md:w-[50%] bg-white p-6 shadow-lg transform transition-transform duration-[600ms] ease-in-out ${showFilters ? "translate-x-0" : "translate-x-full"
              }`}
          >
            <button
              onClick={() => setShowFilters(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-[#F16935] transition-colors "
            >
              <X size={28} />
            </button>
            <div className="mt-[2rem]">{renderFilterSections()}</div>
          </div>
        </div>
        {/* ✅ Outfit Cards */}
        {apiOutfitData?.recommendations?.length > 0 ? (
          (() => {
            const grouped = {};
            apiOutfitData.recommendations.forEach((item) => {
              const cat = item["category"];
              if (!grouped[cat]) grouped[cat] = [];
              grouped[cat].push(item);
            });
            const categories = Object.keys(grouped);
            const catCount = categories.length;

            const cycle = catCount % 3;
            
            return (
              <div className="flex flex-wrap w-full gap-[2%]">
                {Object.keys(grouped).map((cat) => {
                  const first = grouped[cat][0];
                  return (
                    <div
                      key={cat}
                      onClick={() =>
                        router.push(
                          `/articles-assortis?id=${encodeURIComponent(cat)}`
                        )
                      }
                      className={`cursor-pointer mt-[2%]  py-[1rem] lg:py-0 w-full  md:w-[48%]    bg-[#f6f6f6] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all`}
                    >
                      <div className="relative w-full h-72 lg:h-[11vw] ">
                        <Image
                          src={first["image_url_1"]}
                          alt={cat}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="p-5 bg-[#F16935]/10">
                        <h4 className="flex items-center justify-between gap-2">
                          {cat}
                          {/* 👉 show arrow only on mobile */}
                          <ArrowRight
                            size={25}
                            className="text-[#F16935] block md:hidden"
                          />
                        </h4>
                        <p className="mb-[1rem] lg:my-[2%]">
                          {grouped[cat].length} produits
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()
        ) : (
          <div className={`w-full flex flex-wrap gap-x-[2%] `} >
            {filteredData
              .map(([key, categoryData]) => {
                const cycle = filteredData.length % 3;
                // const cardWidth =
                //   cycle === 2 ? "2xl:w-[48%]" : cycle === 1 ? "2xl:w-[23.5%]" :cycle === 0?"2xl:w-[32%]": "2xl:w-[23.5%]";

                const firstProduct = Object.values(categoryData)
                  .flat()
                  .find((item) => item?.["image_url_1"]);

                return (
                  <div
                    key={key}
                    onClick={() => {
                      if (firstProduct) {
                        router.push(
                          `/articles-assortis?id=${encodeURIComponent(key)}`
                        );
                      } else {
                        toast.warning(
                          "Aucune donnée disponible pour cette catégorie."
                        );
                      }
                    }}
                    className={`${!firstProduct ? "cursor-default" : "cursor-pointer"
                      } py-[1rem] mt-[2%] lg:p-0  w-full  md:w-[48%] bg-[#f6f6f6] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all ${!firstProduct ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                  >
                    <div className="relative w-full h-[25rem]  lg:h-[11vw]">
                      <Image
                        src={
                          firstProduct?.["image_url_1"] ||
                          "/color-fact.png"
                        }
                        alt={key}
                        fill
                        className={`object-contain transition-all duration-300 ${!firstProduct ? "grayscale opacity-80" : ""
                          }`}
                      />
                    </div>
                    <div className="p-5 bg-[#F16935]/10">
                      <h4 className="flex items-center justify-between gap-2">
                        {key}
                        <ArrowRight
                          size={25}
                          className={`${!firstProduct ? "text-gray-400" : "text-[#F16935]"
                            } block md:hidden`}
                        />
                      </h4>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OutfitFilterPage;
