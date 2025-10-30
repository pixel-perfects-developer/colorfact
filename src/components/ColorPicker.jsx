"use client";
import { useEffect, useRef, useState } from "react";
import iro from "@jaames/iro";
import DropDownMenu from "./DropDownMenu";
import { getOutfitByColor } from "@/api/outfit_by_color";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setColors } from "@/redux/slices/colorSlice";
import { setImageDetails } from "@/redux/slices/imageDetailsSlice";
import { useRouter } from "next/navigation";

const ColorPicker = () => {
  const colorPickerRef = useRef(null);
  const [hex, setHex] = useState("#00cfaa");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [dropdownValues, setDropdownValues] = useState({
    gender: "",
    subcategory: "",
  });

  console.log('dropdownValues======>', dropdownValues);
  
  useEffect(() => {
    if (!colorPickerRef.current) return;
    colorPickerRef.current.innerHTML = "";

    const picker = new iro.ColorPicker(colorPickerRef.current, {
      width: 220,
      color: hex,
      borderWidth: 1,
      borderColor: "#ccc",
    });

    picker.on("color:change", (color) => {
      const selectedHex = color.hexString;
      setHex(selectedHex);
      dispatch(setColors(selectedHex)); // 🔹 store in Redux
    });
    return () => {
      if (colorPickerRef.current) colorPickerRef.current.innerHTML = "";
    };
  }, []);

  const handleDropdownSelect = ({ gender, subcategory }) => {
    setDropdownValues({ gender, subcategory });
  };

  const handleAnalyze = async () => {
    const { gender, subcategory } = dropdownValues;
    if (!gender || !subcategory) {
      alert("Please select gender and clothing type first.");
      return;
    }
    setLoading(true);
    try {
      const response = await getOutfitByColor({
        color: hex,
        clothing_type: subcategory,
        gender: gender === "Homme" ? "H" : values.gender === "Femme" ? "F" : "H/F"
      });
      dispatch(setImageDetails(response));
      router.push('/articles')
      toast.success("Analysis complete!.");
    } catch (err) {
      toast.error("Failed to fetch outfit recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F9F3E9]">
      <div className="container-global min-h-[clamp(32rem,79vh,50rem)] flex flex-col items-center justify-center select-none">
        <div className="mb-2" ref={colorPickerRef} />

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
