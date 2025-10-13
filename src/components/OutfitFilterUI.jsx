"use client";
import Image from "next/image";
import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

const DummyData = {
  baseColors: [
    { name: "Blue", hex: "#2D5BFF" },
    { name: "Gray", hex: "#8A8A8A" },
    { name: "White", hex: "#F4F4F4" },
  ],
  brands: [{ name: "Nike" }, { name: "Adidas" }, { name: "Under Armour" }],
  brandstoavoid: [{ name: "Gucci" }, { name: "Balenciaga" }],
  price: [
    { label: "$0 - $50", min: 0, max: 50 },
    { label: "$50 - $100", min: 50, max: 100 },
    { label: "$100 - $200", min: 100, max: 200 },
  ],
  style: [{ name: "Casual" }, { name: "Formal" }, { name: "Sportswear" }],
};

// 🔹 Dummy Product List
const allProducts = [
  {
    id: 1,
    name: "Blue Casual Shirt",
    color: "Blue",
    brand: "Gucci",
    style: "Casual",
    price: 60,
    image: "/suit.png",
  },
  {
    id: 2,
    name: "Gray Formal Pants",
    color: "Gray",
    brand: "Adidas",
    style: "Formal",
    price: 90,
    image: "/suit.png",
  },
  {
    id: 3,
    name: "White Casual Tee",
    color: "White",
    brand: "Nike",
    style: "Casual",
    price: 40,
    image: "/suit.png",
  },
  {
    id: 4,
    name: "Blue Sportswear Shorts",
    color: "Blue",
    brand: "Balenciaga",
    style: "Sportswear",
    price: 110,
    image: "/suit.png",
  },
];

// 🎨 Color Adjust Helper
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
const router=useRouter()
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
    setShowFilters(false); // close drawer after applying on mobile
  };

  const renderFilterSections = () => (
    <> {[
          { id: "color", title: "Color", data: DummyData.baseColors },
          { id: "brands", title: "Brands", data: DummyData.brands },
          { id: "avoid", title: "Brands to Avoid", data: DummyData.brandstoavoid },
          { id: "price", title: "Price", data: DummyData.price },
          { id: "style", title: "Style", data: DummyData.style },
        ].map((section) => (
          <div key={section.id} className="border-b border-gray-200 py-[4%]">
            {/* Header */}
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

            {/* Transition wrapper */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                openSection === section.id
                  ? "max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {/* Color */}
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

              {/* Brands */}
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

              {/* Avoid */}
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

              {/* Price */}
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

        {/* Search Button */}
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
  SEARCH
</button>

    </>
  );

  return (
    <div className="bg-[#faf5e7]">
    <div className="container-global  flex flex-col md:flex-row gap-x-[4%] relative min-h-screen">
      {/* 🟢 Mobile Filter Button */}
      <button
        className=" md:hidden flex justify-end"
        onClick={() => setShowFilters(true)}
      >
        <SlidersHorizontal size={30}  />
      </button>

      {/* 🔹 Mobile Filter Drawer */}
{showFilters && (
  <div
  className={`fixed inset-0 z-4000 lg:hidden bg-black/50 backdrop-blur-sm transition-opacity duration-500 ease-out ${
    showFilters ? "opacity-100 visible" : "opacity-0 invisible"
  }`}
  onClick={() => setShowFilters(false)}
>
  {/* Drawer */}
  <div
    className={`fixed top-0 right-0 md:hidden h-full w-[80%] bg-white shadow-2xl rounded-tl-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
      showFilters
        ? "translate-x-0 translate-y-0"
        : "translate-x-full translate-y-2"
    } overflow-y-auto p-4`}
    onClick={(e) => e.stopPropagation()} // prevent backdrop close on inside click
  >
    {/* Header */}
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">Filters</h3>
      <button
        className="text-gray-600 font-semibold"
        onClick={() => setShowFilters(false)}
      >
        ✕
      </button>
    </div>

    {/* Filter content */}
    {renderFilterSections()}
  </div>
</div>

)}


      {/* 🔹 Desktop Sidebar */}
      <aside className="hidden md:block md:w-[30%] lg:w-[20%] ">
        <h3 className="mb-[2%] text-lg font-semibold">Filters</h3>
        {renderFilterSections()}
      </aside>

      {/* 🔹 Product Grid */}
      <main className="flex-1 grid grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-0 lg:gap-8 p-4 lg:p-0">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div key={p.id} className="flex flex-col items-center mt-[2rem] lg:mt-0 cursor-pointer"   onClick={() => router.push(`/articles/${p.name.toLowerCase().replace(/\s+/g, '-')}`)}
>
              <div className="bg-[#f2ede4] rounded-lg p-[2%] shadow-sm relative w-full h-[20rem] md:h-auto md:aspect-[1/1]">
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
            No products found.
          </p>
        )}
      </main>
    </div>
    </div>

  );
};

export default OutfitFilterPage;
