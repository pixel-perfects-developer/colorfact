"use client";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { setOutfits } from "@/redux/slices/outfitRecommendationSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
console.log("c",colors);

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

  // ✅ Clear API outfit data and revert to default outfitKeys data
  dispatch(setOutfits({}));
  toast.info("Filtres réinitialisés, affichage par défaut restauré 🔄", {
    position: "top-center",
  });
};


  const applyFilters = async () => {
    try {
      if (!tempFilters.category) {
        toast.error("Veuillez sélectionner au moins une catégorie.", {
          position: "top-center",
        });
        return;
      }

      setLoading(true);
      const selectedType = tempFilters.category;

   const adjustedColors =
  Array.isArray(colorData) && colorData.length
    ? colorData.map((c, i) => {
        const hexValue = c.hex || c; // ✅ handles both {hex: '#AABBCC'} and plain '#AABBCC'
        const adj = adjustColor(hexValue, colorIntensity[i] || 50);
        const rgb = adj.match(/\d+/g);
        return rgb
          ? rgb
              .map((v) => parseInt(v).toString(16).padStart(2, "0"))
              .join("")
              .toUpperCase()
          : hexValue.replace(/^#/, "");
      })
    : [];

const params = new URLSearchParams();
if (adjustedColors.length)
  params.append("input_colors", adjustedColors.join(",")); // ✅ use join

      params.append("type", selectedType);
      params.append("minPrice", tempFilters.minPrice);
      params.append("maxPrice", tempFilters.maxPrice);
      if (tempFilters.brands.length)
        params.append("wanted_brands", tempFilters.brands.join(","));
      if (tempFilters.avoid.length)
        params.append("removed_brands", tempFilters.avoid.join(","));

      const res = await fetch(`/api/outfit_recommendation?${params.toString()}`);
      console.log("params.toString()",params.toString());
      
      const data = await res.json();

      if (!res.ok) {
        toast.error("Erreur lors du chargement des recommandations.", {
          position: "top-center",
        });
        throw new Error("API Error");
      }

      dispatch(setOutfits(data));
      toast.success("Recommandations mises à jour avec succès 🎉", {
        position: "top-center",
      });
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
          id: "catégorie",
          title: "catégorie",
          data: outfitKeys.map((key) => ({ name: key })),
        },
        {
          id: "brands",
          title: "Marques",
          data: [{ name: "Nike" }, { name: "Adidas" }, { name: "Under Armour" }],
        },
        {
          id: "avoid",
          title: "Marques à éviter",
          data: [{ name: "Gucci" }, { name: "Balenciaga" }],
        },
        { id: "price", title: "Prix", data: [] },
      ].map((section) => (
        <div key={section.id} className="border-b border-gray-200 py-[4%]">
          <div
            onClick={() => toggleSection(section.id)}
            className="flex items-center justify-between cursor-pointer mb-[2%]"
          >
            <h4 className="font-bold">{section.title}</h4>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 ml-2 text-gray-600 transition-transform duration-300 ${
                openSection === section.id ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              openSection === section.id ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {section.id === "color" &&
              section.data.map((c, i) => {
                const adjusted = adjustColor(c.hex, colorIntensity[i]);
                return (
                  <div key={i} className="flex items-center gap-3 mb-[4%]">
                    <div
                      className="w-4 h-4 rounded-full border border-gray-400"
                      style={{ backgroundColor: adjusted }}
                    ></div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={colorIntensity[i]}
                      onChange={(e) => {
                        setFiltersApplied(false);
                        const value = parseInt(e.target.value);
                        setColorIntensity((prev) =>
                          prev.map((v, idx) => (idx === i ? value : v))
                        );
                        if (!tempFilters.colors.includes(c.hex)) {
                          handleCheckbox("colors", c.hex, true);
                        }
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

            {section.id === "catégorie" &&
              section.data.map((cat, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={tempFilters.category === cat.name}
                    onChange={() => {
                      setFiltersApplied(false);
                      setTempFilters((prev) => ({ ...prev, category: cat.name }));
                    }}
                    className="accent-[#F16935]"
                  />
                  <h5>{cat.name}</h5>
                </label>
              ))}

            {section.id === "brands" &&
              section.data.map((b, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempFilters.brands.includes(b.name)}
                    onChange={(e) => handleCheckbox("brands", b.name, e.target.checked)}
                    className="accent-[#F16935]"
                  />
                  <h5>{b.name}</h5>
                </label>
              ))}

            {section.id === "avoid" &&
              section.data.map((b, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempFilters.avoid.includes(b.name)}
                    onChange={(e) => handleCheckbox("avoid", b.name, e.target.checked)}
                    className="accent-[#F16935]"
                  />
                  <h5>{b.name}</h5>
                </label>
              ))}

            {section.id === "price" && openSection === "price" && (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Prix minimum (€)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={tempFilters.minPrice}
                    onChange={(e) => {
                      setFiltersApplied(false);
                      setTempFilters((prev) => ({
                        ...prev,
                        minPrice: Math.max(0, Math.min(1000, Number(e.target.value))),
                      }));
                    }}
                    className="border rounded-md p-2 w-full text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Prix maximum (€)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={tempFilters.maxPrice}
                    onChange={(e) => {
                      setFiltersApplied(false);
                      setTempFilters((prev) => ({
                        ...prev,
                        maxPrice: Math.max(0, Math.min(1000, Number(e.target.value))),
                      }));
                    }}
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
        className={`w-full ${
          !tempFilters.category || filtersApplied || loading
            ? "bg-[#8f4c2d36] cursor-not-allowed"
            : "bg-[#2D3F8F]"
        } text-white font-medium py-2 rounded-md mt-6`}
      >
        {loading ? "Chargement..." : filtersApplied ? "Déjà appliqué " : "RECHERCHER"}
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
    <div className="bg-[#faf5e7] min-h-screen py-10">
      <div className="container-global flex flex-col items-start md:flex-row gap-x-[4%] relative">
        <button
          className="md:hidden flex justify-end mb-4"
          onClick={() => setShowFilters(true)}
        >
          <SlidersHorizontal size={30} />
        </button>

        <aside className="hidden md:block md:w-[30%] lg:w-[20%]">
          <h3 className="mb-[2%] text-lg font-semibold">Filtres</h3>
          {renderFilterSections()}
        </aside>

        {/* ✅ Outfit Cards */}
        {apiOutfitData?.recommendations?.length > 0 ? (
          (() => {
            const grouped = {};
            apiOutfitData.recommendations.forEach((item) => {
              const cat = item["Catégorie produit"];
              if (!grouped[cat]) grouped[cat] = [];
              grouped[cat].push(item);
            });
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-[2%]">
                {Object.keys(grouped).map((cat) => {
                  const first = grouped[cat][0];
                  return (
                    <div
                      key={cat}
onClick={() => router.push(`/articles-assortis/${encodeURIComponent(cat)}`)}
                      className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
                    >
                      <div className="relative w-full h-64">
                        <Image
                          src={first["Photo produit 1"] || "/placeholder.jpg"}
                          alt={cat}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-semibold text-gray-800">{cat}</h3>
                        <p className="text-gray-500 text-sm mt-1">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-[2%]">
            {outfitKeys.map((key) => {
              const firstProduct = Object.values(outfitData[key])
                .flat()
                .find((item) => item?.product_id);
              return (
                <div
                  key={key}
                  onClick={() => router.push(`/articles-assortis/${key}`)}
                  className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
                >
                  <div className="relative w-full h-64">
                    <Image
                      src={firstProduct?.product_id || "/placeholder.jpg"}
                      alt={key}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-800">{key}</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {Object.keys(outfitData[key]).length} catégories
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutfitFilterPage;
