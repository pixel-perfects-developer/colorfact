"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
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

  // ✅ Adjust brightness based on slider value (0–100%)
  l += (percent - 50) / 100;
  l = Math.max(0, Math.min(1, l));

  // Convert back to RGB
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
  const outfitKeys = Object.keys(outfitData);

// ✅ Check if outfitData is empty or all keys contain empty arrays/objects
const isEmptyOutfitData =
  !outfitKeys.length ||
  outfitKeys.every((key) => {
    const value = outfitData[key];
    // handle object-of-arrays structure
    return (
      !value ||
      (typeof value === "object" &&
        Object.values(value).flat().length === 0)
    );
  });

if (isEmptyOutfitData) {
  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-[#faf5e7]">
      <p className="text-gray-500 text-lg">
        No outfit recommendations available. Try searching by image or color.
      </p>
    </div>
  );
}

  const [openSection, setOpenSection] = useState("color");
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  const colorData = useSelector((state) => state.color?.colors);
  const colors = Array.isArray(colorData)
    ? colorData.map((c) => ({ hex: c }))
    : colorData
      ? [{ hex: colorData }]
      : [];

  const [colorIntensity, setColorIntensity] = useState(colors.map(() => 50));
  const [tempFilters, setTempFilters] = useState({
    colors: [],
    brands: [],
    avoid: [],
    price: [],
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleSection = (id) => setOpenSection(openSection === id ? null : id);

  const handleCheckbox = (type, name, checked, extra = null) => {
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

  const applyFilters = async () => {
    setLoading(true);
    try {
      // 🧠 Compute price range from selected filters
      const minPrice = tempFilters.price.length
        ? Math.min(...tempFilters.price.map((p) => p.min))
        : 0;
      const maxPrice = tempFilters.price.length
        ? Math.max(...tempFilters.price.map((p) => p.max))
        : 1000;

      // 🧩 Prepare payload — EXACT same as your confirmed valid structure
      const payload = {
        inputColors: tempFilters.colors.length
          ? tempFilters.colors
          : colors.map((c) => c.hex),
        type: "Casual été", // or use dropdown-selected type if you have one
        minPrice,
        maxPrice,
        wantedBrands: tempFilters.brands,
        removedBrands: tempFilters.avoid,
      };

      console.log("🧾 Sending payload:", payload);

      // 🚀 Call the API helper
      const response = await getOutfitRecommendation(payload);

      console.log("✅ API Response:", response);
      setFilteredProducts(response?.results || response?.data || []);
    } catch (err) {
      console.error("❌ Error fetching recommendations:", err);
    } finally {
      setLoading(false);
      setShowFilters(false);
    }
  };
// ✅ Converts "rgb(r,g,b)" → "#rrggbb"
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
          id: "brands",
          title: "Marques",
          data: [{ name: "Nike" }, { name: "Adidas" }, { name: "Under Armour" }],
        },
        {
          id: "avoid",
          title: "Marques à éviter",
          data: [{ name: "Gucci" }, { name: "Balenciaga" }],
        },
        {
          id: "price",
          title: "Prix",
          data: [
            { label: "€0 - €50", min: 0, max: 50 },
            { label: "€50 - €100", min: 50, max: 100 },
            { label: "€100 - €200", min: 100, max: 200 },
          ],
        },
      ].map((section) => (
        <div key={section.id} className="border-b border-gray-200 py-[4%]">
          <div
            onClick={() => toggleSection(section.id)}
            className="flex items-center justify-between cursor-pointer mb-[2%]"
          >
            <h4 className="font-bold">{section.title}</h4>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 ml-2 text-gray-600 transition-transform duration-300 ${openSection === section.id ? "rotate-180" : "rotate-0"
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
  openSection === "color" &&
  section.data.map((c, i) => {
    const adjusted = adjustColor(c.hex, colorIntensity[i]);
    return (
      <div key={i} className="flex items-center gap-3 mb-[4%]">
        {/* Left circle – Original color */}
        {/* <div
          className="w-4 h-4 rounded-full border border-gray-400"
          style={{ backgroundColor: c.hex }}
          title={`Original ${c.hex}`}
        ></div> */}
  <div
          className="w-4 h-4 rounded-full border border-gray-400"
          style={{ backgroundColor: adjusted }}
          title={`Adjusted ${adjusted}`}
        ></div>
        {/* Range slider with gradient from original → adjusted */}
        <input
          type="range"
          min="0"
          max="100"
          value={colorIntensity[i]}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            setColorIntensity((prev) =>
              prev.map((v, idx) => (idx === i ? value : v))
            );
            if (!tempFilters.colors.includes(c.hex)) {
              handleCheckbox("colors", c.hex, true);
            }
          }}
          className="flex-1 h-2 cursor-pointer appearance-none rounded-full"
          style={{
            accentColor: c.hex,
            background: `linear-gradient(to right, ${c.hex} 0%, ${adjusted} 100%)`,
          }}
        />

        {/* Right circle – Adjusted color */}
      

        {/* Hex label */}
<span className="text-xs text-gray-700">{rgbToHex(adjusted)}</span>
      </div>
    );
  })}


            {section.id === "brands" &&
              openSection === "brands" &&
              section.data.map((b, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer">
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
              ))}

            {section.id === "avoid" &&
              openSection === "avoid" &&
              section.data.map((b, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer">
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

            {section.id === "price" &&
              openSection === "price" &&
              section.data.map((p, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleCheckbox("price", null, e.target.checked, p)
                    }
                    className="accent-[#F16935]"
                  />
                  <h5>{p.label}</h5>
                </label>
              ))}
          </div>
        </div>
      ))}

      <button
        disabled={
          !tempFilters.price.length &&
          !tempFilters.avoid.length &&
          !tempFilters.brands.length &&
          !tempFilters.colors.length
        }
        onClick={applyFilters}
        className={`w-full ${!tempFilters.price.length &&
          !tempFilters.avoid.length &&
          !tempFilters.brands.length &&
          !tempFilters.colors.length
          ? "bg-[#8f4c2d36] cursor-not-allowed"
          : "bg-[#2D3F8F]"
          } text-white font-medium py-2 rounded-md mt-6`}
      >
        {loading ? "Chargement..." : "RECHERCHER"}
      </button>
    </>
  );

  return (
  <div className="bg-[#faf5e7] min-h-[80vh] py-10">
      <div className="container-global flex flex-col md:flex-row gap-x-[4%] relative">
        {/* 📱 Mobile Filter Button */}
        <button
          className="md:hidden flex justify-end mb-4"
          onClick={() => setShowFilters(true)}
        >
          <SlidersHorizontal size={30} />
        </button>

        {/* 🖥️ Sidebar (Desktop) */}
        <aside className="hidden md:block md:w-[30%] lg:w-[20%]">
          <h3 className="mb-[2%] text-lg font-semibold">Filtres</h3>
          {renderFilterSections()}
        </aside>

        {/* 🧩 Outfit Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-[2%]">

          {outfitKeys.map((key) => {
            const firstProduct = Object.values(outfitData[key])
              .flat()
              .find((item) => item?.product_id);
console.log("sss",outfitData);

            return (
              <div
                key={key}
                onClick={() => router.push(`/articles/${key}`)}
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
                    {Object.keys(outfitData[key]).length} categories
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 📱 Mobile Drawer */}
        {showFilters && (
          <>
            {/* Dark Overlay */}
            <div
              className={`fixed inset-0 bg-black/30 transition-opacity duration-300 ease-in-out ${
                showFilters ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => setShowFilters(false)}
            ></div>

            {/* Sliding Drawer */}
            <div
              className={`fixed top-[6.2rem] z-100 right-0  h-full w-[80%] sm:w-[70%] bg-white shadow-lg rounded-tl-2xl transform transition-transform duration-[600ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
                showFilters ? "translate-x-0" : "translate-x-full"
              } overflow-y-auto p-6`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filtres</h3>
                <button
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setShowFilters(false)}
                >
                  ✕
                </button>
              </div>
              {renderFilterSections()}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OutfitFilterPage;
