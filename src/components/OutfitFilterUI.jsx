"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { getOutfitRecommendation } from "@/api/outfit_recommendation";

const adjustColor = (hex, percent) => {
  if (!hex?.startsWith("#")) return hex;
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);
  r = Math.min(255, Math.max(0, r + (percent - 50) * 2));
  g = Math.min(255, Math.max(0, g + (percent - 50) * 2));
  b = Math.min(255, Math.max(0, b + (percent - 50) * 2));
  return `rgb(${r}, ${g}, ${b})`;
};

const OutfitFilterPage = () => {
  const outfitData = useSelector((state) => state.imageDetails.details || {});
  const outfitKeys = Object.keys(outfitData);

  if (!outfitKeys.length)
    return (
      <div className="flex justify-center items-center min-h-[70vh] bg-[#faf5e7]">
        <p className="text-gray-500 text-lg">
          No outfit recommendations available. Try searching by image or color.
        </p>
      </div>
    );

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
                    <div
                      className="w-4 h-4 rounded-full border border-gray-400"
                      style={{ backgroundColor: adjusted }}
                    ></div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={colorIntensity[i]}
                      onChange={(e) =>
                        setColorIntensity((prev) =>
                          prev.map((v, idx) =>
                            idx === i ? parseInt(e.target.value) : v
                          )
                        )
                      }
                      onMouseUp={() =>
                        handleCheckbox(
                          "colors",
                          c.hex,
                          !tempFilters.colors.includes(c.hex)
                        )
                      }
                      className="flex-1 h-2 cursor-pointer appearance-none accent-[#000000]"
                      style={{
                        background: `linear-gradient(to right, ${adjusted} ${colorIntensity[i]}%, #bdbdbd ${colorIntensity[i]}%)`,
                      }}
                    />
                    <span className="text-xs text-gray-700">{c.hex}</span>
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

        <main className="flex-1 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p, i) => (
              <div
                key={i}
                className="flex flex-col items-center mt-[2rem] cursor-pointer"
              >
                <div className="bg-[#f2ede4] rounded-lg p-[2%] shadow-sm relative w-full aspect-square">
                  <Image
                    src={p.image || "/suit.png"}
                    alt={p.name}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <h4 className="font-bold mt-[1rem] text-center">{p.name}</h4>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              Aucun produit trouvé.
            </p>
          )}
        </main>
      </div>

      <div className="container-global">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
          Recommended Outfits
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {outfitKeys.map((key) => {
            const firstProduct = Object.values(outfitData[key])
              .flat()
              .find((item) => item?.product_id);

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
      </div>
    </div>
  );
};

export default OutfitFilterPage;
