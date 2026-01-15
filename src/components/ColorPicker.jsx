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
import { setOutfits } from "@/redux/slices/outfitRecommendationSlice";

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

  // ✅ Set default color in Redux on mount, clear it on unmount
  useEffect(() => {
    dispatch(setColors(["#00cfaa"]));
  }, [dispatch]);

  // ✅ Initialize color picker
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
      dispatch(setColors([selectedHex])); // store in Redux
      dispatch(setOutfits([]));
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
    toast.error("Veuillez sélectionner le genre et la catégorie du vêtement d’abord.");
    return;
  }

  setLoading(true);
  try {
    const response = await getOutfitByColor({
      color: hex,
      clothing_type: subcategory,
      gender: gender === "Homme" ? "H" : gender === "Femme" ? "F" : "H/F",
    });

    // ⛔ CASE 1: No outfits found → stay on page + show message
    if (!response || !response?.outfits || response.outfits.length === 0) {
      toast.info("Aucun article assorti trouvé pour votre vêtement.");
      dispatch(setOutfits([]));       // clear previous outfits
      return;                         // do NOT redirect
    }

    // ✅ CASE 2: Outfits found → proceed normally
    dispatch(setImageDetails(response.outfits));
    router.push("/articles-assortis");

  } catch (err) {
    toast.error("Échec de la récupération des recommandations d’outfit.");
  } finally {
    setLoading(false);
  }
};


  const analyzeDisabled = !dropdownValues.gender || !dropdownValues.subcategory || loading;

  return (
    <div className="bg-[#F9F3E9]">
      <div className="container-global lg:w-[70%] mx-auto min-h-[calc(100vh-280px)] md:min-h-[calc(100vh-237.27px)] lg:min-h-[calc(100vh-19vh)] xl:min-h-[calc(100vh-18.5vh)]  2xl:min-h-[calc(100vh-19vh)] flex flex-col items-center justify-center select-none">
        {/* 🎨 Color Picker */}
        <div className="mb-6" ref={colorPickerRef} />

        {/* 🔽 Dropdown Section */}
        <DropDownMenu onSelect={handleDropdownSelect} />

        {/* 🔘 CTA */}
        <div className="flex justify-center mt-[2rem] lg:mt-[2%]">
          <button
            onClick={handleAnalyze}
            disabled={analyzeDisabled}
            className={`btn-orange ${analyzeDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Analyse en cours..." : "Analyser mon vêtement"}
          </button>
        </div>

        {/* 🧠 Loading Message */}
        {loading && (
          <p className="text-center mt-[2rem] lg:mt-[2%] animate-pulse">
            Nous analysons les couleurs et le style de votre article afin de vous
            suggérer des vêtements assortis.
          </p>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
