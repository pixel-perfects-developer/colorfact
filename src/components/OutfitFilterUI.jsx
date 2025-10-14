"use client";
import Image from "next/image";
import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

const DummyData = {
  baseColors: [
    { name: "Bleu", hex: "#2D5BFF" },
    { name: "Gris", hex: "#8A8A8A" },
    { name: "Blanc", hex: "#F4F4F4" },
  ],
  brands: [{ name: "Nike" }, { name: "Adidas" }, { name: "Under Armour" }],
  brandstoavoid: [{ name: "Gucci" }, { name: "Balenciaga" }],
  price: [
    { label: "€0 - €50", min: 0, max: 50 },
    { label: "€50 - €100", min: 50, max: 100 },
    { label: "€100 - €200", min: 100, max: 200 },
  ],
  style: [{ name: "Décontracté" }, { name: "Formel" }, { name: "Sportif" }],
};

// 🔹 Liste de produits factices
const allProducts = [
  {
    id: 1,
    name: "Chemise Bleue Décontractée",
    color: "Bleu",
    brand: "Gucci",
    style: "Décontracté",
    price: 60,
    image: "/suit.png",
  },
  {
    id: 2,
    name: "Pantalon Gris Formel",
    color: "Gris",
    brand: "Adidas",
    style: "Formel",
    price: 90,
    image: "/suit.png",
  },
  {
    id: 3,
    name: "T-shirt Blanc Décontracté",
    color: "Blanc",
    brand: "Nike",
    style: "Décontracté",
    price: 40,
    image: "/suit.png",
  },
  {
    id: 4,
    name: "Short Bleu de Sport",
    color: "Bleu",
    brand: "Balenciaga",
    style: "Sportif",
    price: 110,
    image: "/suit.png",
  },
];

// 🎨 Fonction d’ajustement des couleurs
const adjustColor = (hex, percent) => {
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);
  r = Math.min(255, Math.max(0, r + (percent - 50) * 2));
  g = Math.min(255, Math.max(0, g + (percent - 50) * 2));
  b = Math.min(255, Math.max(0, b + (percent - 50) * 2));
  return `rgb(${r}, ${g}, ${b})`;
};

const OutfitFilterPage = () => {
  const [openSection, setOpenSection] = useState("color");
  const [colorIntensity, setColorIntensity] = useState(
    DummyData.baseColors.map(() => 50)
  );
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  const [tempFilters, setTempFilters] = useState({
    colors: [],
    brands: [],
    avoid: [],
    style: [],
    price: [],
  });
  const [filteredProducts, setFilteredProducts] = useState(allProducts);

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

  const applyFilters = () => {
    const filtered = allProducts.filter((p) => {
      const colorMatch =
        tempFilters.colors.length === 0 || tempFilters.colors.includes(p.color);
      const brandMatch =
        tempFilters.brands.length === 0 || tempFilters.brands.includes(p.brand);
      const avoidMatch =
        tempFilters.avoid.length === 0 || !tempFilters.avoid.includes(p.brand);
      const styleMatch =
        tempFilters.style.length === 0 || tempFilters.style.includes(p.style);
      const priceMatch =
        tempFilters.price.length === 0 ||
        tempFilters.price.some(
          (range) => p.price >= range.min && p.price <= range.max
        );
      return colorMatch && brandMatch && avoidMatch && styleMatch && priceMatch;
    });
    setFilteredProducts(filtered);
    setShowFilters(false);
  };

  const renderFilterSections = () => (
    <>
      {[
        { id: "color", title: "Couleur", data: DummyData.baseColors },
        { id: "brands", title: "Marques", data: DummyData.brands },
        { id: "avoid", title: "Marques à éviter", data: DummyData.brandstoavoid },
        { id: "price", title: "Prix", data: DummyData.price },
        { id: "style", title: "Style", data: DummyData.style },
      ].map((section) => (
        <div key={section.id} className="border-b border-gray-200 py-[4%]">
          {/* En-tête */}
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Section déroulante */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              openSection === section.id
                ? "max-h-[500px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            {/* Couleur */}
            {section.id === "color" && openSection === "color" && (
              <div className="mt-[2%]">
                {section.data.map((c, i) => {
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
                            c.name,
                            !tempFilters.colors.includes(c.name)
                          )
                        }
                        className="flex-1 h-2 cursor-pointer appearance-none accent-[#000000]"
                        style={{
                          background: `linear-gradient(to right, ${adjusted} ${colorIntensity[i]}%, #bdbdbd ${colorIntensity[i]}%)`,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Marques */}
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

            {/* Marques à éviter */}
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

            {/* Prix */}
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

            {/* Style */}
            {section.id === "style" &&
              openSection === "style" &&
              section.data.map((s, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempFilters.style.includes(s.name)}
                    onChange={(e) =>
                      handleCheckbox("style", s.name, e.target.checked)
                    }
                    className="accent-[#F16935]"
                  />
                  <h5>{s.name}</h5>
                </label>
              ))}
          </div>
        </div>
      ))}

      {/* Bouton de recherche */}
      <button
        disabled={
          tempFilters.price.length === 0 &&
          tempFilters.style.length === 0 &&
          tempFilters.avoid.length === 0 &&
          tempFilters.brands.length === 0 &&
          tempFilters.colors.length === 0
        }
        onClick={applyFilters}
        className={`w-full ${
          tempFilters.price.length === 0 &&
          tempFilters.style.length === 0 &&
          tempFilters.avoid.length === 0 &&
          tempFilters.brands.length === 0 &&
          tempFilters.colors.length === 0
            ? "bg-[#8f4c2d36] cursor-not-allowed"
            : "bg-[#2D3F8F]"
        } text-white font-medium py-2 rounded-md mt-6`}
      >
        RECHERCHER
      </button>
    </>
  );

  return (
    <div className="bg-[#faf5e7] min-h-screen">
      <div className="container-global flex flex-col md:flex-row gap-x-[4%] relative">
        {/* 🟢 Bouton filtres mobile */}
        <button
          className="md:hidden flex justify-end mb-4"
          onClick={() => setShowFilters(true)}
        >
          <SlidersHorizontal size={30} />
        </button>

        {/* 🔹 Panneau filtres mobile */}
        <div
          className={`fixed inset-0 z-[4000] lg:hidden transition-opacity duration-300 ease-in-out ${
            showFilters ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          {/* Fond assombri */}
          <div
            className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ease-in-out ${
              showFilters ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setShowFilters(false)}
          ></div>

          {/* Panneau latéral */}
          <div
            className={`absolute top-0 right-0 h-full w-[80%] sm:w-[70%] bg-white shadow-lg rounded-tl-2xl transform transition-transform duration-[600ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
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
        </div>

        {/* 🔹 Barre latérale desktop */}
        <aside className="hidden md:block md:w-[30%] lg:w-[20%]">
          <h3 className="mb-[2%] text-lg font-semibold">Filtres</h3>
          {renderFilterSections()}
        </aside>

        {/* 🔹 Grille des produits */}
        <main className="flex-1 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                className="flex flex-col items-center mt-[2rem] lg:mt-0 cursor-pointer"
                onClick={() =>
                  router.push(
                    `/product-analyzation`
                  )
                }
                // href={"/product-analyzation"}  
              >
                <div className="bg-[#f2ede4] rounded-lg p-[2%] shadow-sm relative w-full aspect-square">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <h4 className="font-bold mt-[1rem] lg:mt-[4%]">{p.name}</h4>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              Aucun produit trouvé.
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default OutfitFilterPage;
