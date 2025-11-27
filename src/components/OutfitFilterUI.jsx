"use client";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, SlidersHorizontal, X } from "lucide-react";
import { setOutfits } from "@/redux/slices/outfitRecommendationSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { getOutfitRecommendation } from "@/api/outfit_recommendation";

const adjustColor = (hex, percent = 50) => {
  if (!hex?.startsWith("#")) return hex;
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
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
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
};

const OutfitFilterPage = () => {
  const outfitData = useSelector((state) => state.imageDetails.details || {});
  const apiOutfitData = useSelector((state) => state.outfitRecommendation.outfits || {});
  const outfitKeys = Object.keys(outfitData);
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

  // Disable body scroll when filter drawer is open
  useEffect(() => {
    document.body.style.overflow = showFilters ? "hidden" : "auto";
  }, [showFilters]);

  const toggleSection = (id) => setOpenSection(openSection === id ? null : id);

  const handleCheckbox = (type, name, checked, extra = null) => {
    setFiltersApplied(false);
    setTempFilters((prev) => {
      let updated = [...prev[type]];
      if (checked) updated.push(name);
      else updated = updated.filter((item) => item !== name);
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
    toast.info("Filtres réinitialisés 🔄", { position: "top-center" });
  };

  const applyFilters = async () => {
    try {
      if (!tempFilters.category) {
        toast.error("Veuillez sélectionner une catégorie.", { position: "top-center" });
        return;
      }

      setLoading(true);
      const adjustedColors = Array.isArray(colorData) && colorData.length
        ? colorData.map((c) => {
          let hexValue = typeof c === "object" && c.hex ? c.hex : c;
          if (!hexValue.startsWith("#")) hexValue = "#" + hexValue.replace(/^#*/, "");
          if (/^#([A-Fa-f0-9]{3})$/.test(hexValue))
            hexValue = "#" + hexValue.slice(1).split("").map(ch => ch + ch).join("");
          hexValue = hexValue.toUpperCase();
          if (!/^#[A-F0-9]{6}$/.test(hexValue)) return null;
          return hexValue;
        }).filter(Boolean)
        : [];

      const data = await getOutfitRecommendation({
        inputColors: adjustedColors,
        type: tempFilters.category,
        minPrice: tempFilters.minPrice,
        maxPrice: tempFilters.maxPrice,
        wantedBrands: tempFilters.brands,
        removedBrands: tempFilters.avoid,
      });

      if (data.error) throw new Error(data.error);

      dispatch(setOutfits(data));
      toast.success("Recommandations mises à jour 🎉", { position: "top-center" });
      setFiltersApplied(true);
    } catch (err) {
      toast.error("Erreur lors du filtrage. Réessayez.", { position: "top-center" });
      console.error(err);
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
      {[{ id: "color", title: "Couleur", data: colors },
      { id: "category", title: "Catégorie", data: outfitKeys.map((key) => ({ name: key })) },
      { id: "price", title: "Prix", data: [] }].map((section) => (
        <div key={section.id} className="border-b border-gray-200 py-4">
          <div
            onClick={() => toggleSection(section.id)}
            className="flex items-center justify-between cursor-pointer"
          >
            <h4 className="font-bold">{section.title}</h4>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 transition-transform duration-300 ${openSection === section.id ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <div className={`transition-all duration-500 overflow-hidden ${openSection === section.id ? "max-h-[500px] opacity-100 mt-3" : "max-h-0 opacity-0"}`}>
            {section.id === "color" && section.data.map((c, i) => {
              const adjusted = adjustColor(c.hex, colorIntensity[i]);
              return (
                <div key={i} className="flex items-center gap-3 mb-4">
                  <div className="w-4 h-4 rounded-full border border-gray-400" style={{ backgroundColor: adjusted }}></div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={colorIntensity[i]}
                    onChange={(e) => {
                      setFiltersApplied(false);
                      const value = parseInt(e.target.value);
                      setColorIntensity((prev) => prev.map((v, idx) => (idx === i ? value : v)));
                      if (!tempFilters.colors.includes(c.hex)) handleCheckbox("colors", c.hex, true);
                    }}
                    className="flex-1 h-2 cursor-pointer rounded-full"
                    style={{
                      accentColor: c.hex,
                      background: `linear-gradient(to right, ${c.hex} 0%, ${adjusted} 100%)`,
                    }}
                  />
                  <span className="text-xs text-gray-700">{rgbToHex(adjusted)}</span>
                </div>
              );
            })}

            {section.id === "category" && section.data.map((cat, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer p-1 rounded-md">
                <input
                  type="radio"
                  name="category"
                  onChange={() =>
                    setTempFilters((prev) => ({
                      ...prev,
                      category: prev.category === cat.name ? "" : cat.name,
                    }))
                  }
                  value={tempFilters.category === cat.name}
                  className={`w-4 h-4 cursor-pointer accent-[#F16935]`}
                />
                <h5 className="text-sm text-gray-800">{cat.name}</h5>
              </label>
            ))}

            {section.id === "price" && (
              <div className="flex flex-col gap-3 mt-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Prix minimum (€)</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={tempFilters.minPrice}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        minPrice: Math.max(0, Math.min(1000, Number(e.target.value))),
                      }))
                    }
                    className="border rounded-md p-2 w-full text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Prix maximum (€)</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={tempFilters.maxPrice}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        maxPrice: Math.max(0, Math.min(1000, Number(e.target.value))),
                      }))
                    }
                    className="border rounded-md p-2 w-full text-sm"
                    placeholder="1000"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      <button
        disabled={!tempFilters.category || filtersApplied || loading}
        onClick={applyFilters}
        className={`w-full mt-6 text-white font-medium py-2 rounded-md transition-all ${!tempFilters.category || filtersApplied || loading ? "bg-[#8f4c2d36] cursor-not-allowed" : "bg-[#2D3F8F] hover:bg-[#1f2f7c]"}`}
      >
        {loading ? "Chargement..." : filtersApplied ? "Déjà appliqué" : "RECHERCHER"}
      </button>

      <button
        onClick={resetFilters}
        className="w-full bg-gray-300 text-gray-700 font-medium py-2 rounded-md mt-3 hover:bg-gray-400 transition-all"
      >
        Réinitialiser les filtres
      </button>
    </>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} className="bg-[#faf5e7] min-h-screen py-10">
      <div className="container-global flex flex-col md:flex-row gap-6 px-4 sm:px-6">
        {/* Mobile Filter Button */}
          <button
            className="lg:hidden flex justify-start mb-4 "
            onClick={() => setShowFilters(true)}
          >
            <SlidersHorizontal size={30} />
          </button>

        {/* Desktop Filters */}
        <aside className="hidden lg:block w-[20%]">
          <h3 className="mb-3 text-lg font-semibold">Filtres</h3>
          {renderFilterSections()}
        </aside>

        {/* Mobile Drawer */}
        <div className={`fixed inset-0 z-6000 transition-all duration-500 ${showFilters ? "opacity-100 visible" : "opacity-0 invisible"}`}>
          <div className={`absolute inset-0 bg-black/30 transition-opacity ${showFilters ? "opacity-100" : "opacity-0"}`} onClick={() => setShowFilters(false)}></div>

          <div className={`absolute top-0 right-0 h-full w-[80%] sm:w-[60%] bg-white p-6 shadow-lg transform transition-transform duration-500 ease-in-out overflow-y-auto ${showFilters ? "translate-x-0" : "translate-x-full"}`}>
            <button onClick={() => setShowFilters(false)} className="absolute top-4 right-4 text-gray-600 hover:text-[#F16935]">
              <X size={28} />
            </button>
            <div className="mt-8">{renderFilterSections()}</div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 items-start lg:grid-cols-4 gap-y-6 gap-x-4 w-full">
          {(apiOutfitData?.recommendations?.length
            ? Object.entries(
              apiOutfitData.recommendations.reduce((acc, item) => {
                const cat = item["Catégorie produit"];
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(item);
                return acc;
              }, {})
            )
            : Object.entries(outfitData)
          ).map(([key, categoryData]) => {
            const items = Array.isArray(categoryData)
              ? categoryData
              : Object.values(categoryData || {}).flat();
            const firstProduct = items.find((i) => i?.["Photo produit 1"]);
            if (!firstProduct) return null;

            return (
              <div
                key={key}
                onClick={() => router.push(`/articles-assortis?id=${encodeURIComponent(key)}`)}
                className="cursor-pointer bg-[#f6f6f6] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
              >
                <div className="relative w-full aspect-3/4">
                  <Image
                    src={firstProduct["Photo produit 1"] || "/color-fact.png"}
                    alt={key}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5 bg-[#F16935]/10">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center justify-between gap-2">
                    {key}
                    <ArrowRight size={22} className="text-[#F16935] block md:hidden" />
                  </h3>
                  {!outfitData && <p className="text-gray-500 text-sm mt-1">
                    {items.length} produits
                  </p>
                   }
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default OutfitFilterPage;
