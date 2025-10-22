"use client";
import { useEffect, useRef, useState } from "react";
import Color from "colorjs.io";
import iro from "@jaames/iro";
import DropDownMenu from "./DropDownMenu";
import { getOutfitByColor } from "@/api/outfit_by_color";

const ColorPicker = () => {
  const colorPickerRef = useRef(null);
  const [hex, setHex] = useState("#00cfaa");
  const [loading, setLoading] = useState(false);
  const [dropdownValues, setDropdownValues] = useState({
    gender: "",
    subcategory: "",
  });

  // 🧠 Setup Iro.js Color Picker
  useEffect(() => {
    if (!colorPickerRef.current) return;
    colorPickerRef.current.innerHTML = "";

    const picker = new iro.ColorPicker(colorPickerRef.current, {
      width: 220,
      color: hex,
      borderWidth: 1,
      borderColor: "#ccc",
    });

    picker.on("color:change", (color) => setHex(color.hexString));

    return () => {
      if (colorPickerRef.current) colorPickerRef.current.innerHTML = "";
    };
  }, []);

  // 🧩 Dropdown selection handler
  const handleDropdownSelect = ({ gender, subcategory }) => {
    setDropdownValues({ gender, subcategory });
  };

  // 🚀 Analyze outfit
  const handleAnalyze = async () => {
    const { gender, subcategory } = dropdownValues;

    if (!gender || !subcategory) {
      alert("Please select gender and clothing type first.");
      return;
    }

    setLoading(true);
    try {
      const colorCode = hex.replace("#", "");
      const response = await getOutfitByColor({
  color: "#00cfaa",
  clothing_type: "T-shirt",
  gender: "Homme"
});

      console.log("🧥 Outfit Suggestions:", response);
      alert("Analysis complete! Check console for outfit results.");
    } catch (err) {
      console.error("❌ Outfit analysis failed:", err);
      alert("Failed to fetch outfit recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F9F3E9]">
      <div className="container-global min-h-[clamp(32rem,79vh,50rem)] flex flex-col items-center justify-center select-none">
        <div ref={colorPickerRef} />

        <DropDownMenu onSelect={handleDropdownSelect} />

        <div className="flex justify-center mt-[2rem] lg:mt-[2%]">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`btn-orange ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? "Analyzing..." : "Analyser mon vêtement"}
          </button>
        </div>

        <p className="text-center mt-[2rem] lg:mt-[2%]">
          Nous analysons les couleurs et le style de votre article afin de vous
          suggérer des vêtements assortis.
        </p>
      </div>
    </div>
  );
};

export default ColorPicker;
