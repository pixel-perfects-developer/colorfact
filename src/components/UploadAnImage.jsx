"use client";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import DropDownMenu from "./DropDownMenu";
import { extractColors } from "@/api/extract_colors";
import { getOutfitByImage } from "@/api/outfit_by_image";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setColors } from "@/redux/slices/colorSlice";
import { setImageDetails } from "@/redux/slices/imageDetailsSlice";
import { useRouter } from "next/navigation";
import { setOutfits } from "@/redux/slices/outfitRecommendationSlice";

const UploadAnImage = () => {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // 🧩 Formik setup
  const formik = useFormik({
    initialValues: {
      file: null,
      gender: "",
      subcategory: "",
    },
    validationSchema: Yup.object({
      file: Yup.mixed().required("Veuillez téléverser une image"),
      gender: Yup.string().required("Veuillez sélectionner un genre"),
      subcategory: Yup.string().required("Veuillez sélectionner une catégorie"),
    }),
    onSubmit: async (values) => {
      try {
        if (!values.file) {
          toast.error("Veuillez téléverser une image");
          return;
        }

        if (!values.gender || !values.subcategory) {
          toast.error("Veuillez sélectionner le genre et la catégorie");
          return;
        }
        setLoading(true);
        const colorFile = new File([values.file], values.file.name, {
          type: values.file.type,
        });
        const [colors, outfitResponse] = await Promise.all([
          extractColors(colorFile),
          getOutfitByImage(
            values.file,
            values.subcategory,
            values.gender === "Homme"
              ? "H"
              : values.gender === "Femme"
                ? "F"
                : "H/F"
          ),
        ]);
        
        if (colors && colors.length > 0) {
          dispatch(setColors(colors));
        } else {
          toast.warn("Aucune couleur extraite.");
        }
        if (!outfitResponse || !outfitResponse?.outfits || outfitResponse.outfits.length === 0) {
          toast.info("Aucun article assorti trouvé pour votre vêtement.");
          dispatch(setOutfits([]));
          return;
        }
  dispatch(setImageDetails({
  ...outfitResponse,
  gender: values.gender,
  subcategory: values.subcategory,
}));
        dispatch(setOutfits(outfitResponse));

        formik.resetForm();
        setImagePreview(null);

        router.push("/articles-assortis");

      } catch (err) {
        console.error("Erreur d’analyse :", err);
        toast.error("Échec de l’analyse. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    },

  });

  // 🖼 Handle file selection
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

  const handleFileSelect = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Format invalide (JPG / PNG uniquement)");
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error("Image trop lourde (max 5MB)");
      return;
    }

    formik.setFieldTouched("file", true);
    formik.setFieldValue("file", file);
    setImagePreview(URL.createObjectURL(file));
  };

  // 🧹 Reset state when coming back to page
  useEffect(() => {
    formik.resetForm();
    setImagePreview(null);
  }, []);
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // 📂 File input handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleFileSelect(file);
  };

  // 🧲 Drag-drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file);
  };
  const handleDragOver = (e) => e.preventDefault();

  // 🔽 Dropdown updates
  const handleDropdownSelect = ({ gender, subcategory }) => {
    formik.setFieldTouched("gender", true);
    formik.setFieldTouched("subcategory", true);

    formik.setFieldValue("gender", gender);
    formik.setFieldValue("subcategory", subcategory);
  };

  const analyzeDisabled =
    !formik.values.file ||
    !formik.values.gender ||
    !formik.values.subcategory ||
    loading;

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-[#faf5e7]"
      encType="multipart/form-data"
    >

      <div className="container-global lg:w-[60%]  min-h-[calc(100vh-17rem)]  lg:min-h-[calc(100vh-18vh)] flex flex-col items-center justify-center">
        {/* 🖼 Upload Area */}
        <div
          className={`border-2 border-dashed rounded-[1vw] py-[3%] mb-[2%] w-full cursor-pointer transition-colors ${loading
            ? "border-orange-400 opacity-60 pointer-events-none"
            : "border-gray-400 hover:border-orange-400"
            }`}
          onClick={() => !loading && fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex justify-center">
            <div className="relative w-[40%] md:w-[30%] lg:w-[20%] h-[150px] md:h-[220px]">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  unoptimized
                  alt="vêtement téléversé"
                  fill
                  className="object-contain"
                />
              ) : (
                <Image
                  src="/draganddrop.svg"
                  alt="téléversement d’image"
                  fill
                  className="object-contain"
                />
              )}
            </div>
          </div>

          <p className="text-center  w-[80%] lg:w-[40%] mx-auto text-gray-700">
            {!imagePreview &&
              "Glissez-déposez une photo de votre vêtement préféré et découvrez comment l’associer !"}
          </p>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* ⚠️ Error Display */}

        {/* 🔸 Dropdown Section */}
        <DropDownMenu onSelect={handleDropdownSelect} />
        {formik.touched.file && formik.errors.file && (
          <p className="text-red-500 mt-1">{formik.errors.file}</p>
        )}

        {/* ⚠️ Dropdown Errors */}
        {formik.touched.gender && formik.errors.gender && (
          <p className="text-red-500 mt-1">{formik.errors.gender}</p>
        )}
        {formik.touched.subcategory && formik.errors.subcategory && (
          <p className="text-red-500  mt-1">{formik.errors.subcategory}</p>
        )}

        {/* 🔘 CTA */}
        <div className="flex justify-center mt-[2rem] lg:mt-[2%]">
          <button
            type="submit"
            disabled={analyzeDisabled}
            className={`btn-orange ${analyzeDisabled && "opacity-50 cursor-not-allowed"
              }`}
          >
            {loading ? "Analyse en cours..." : "Analyser mon vêtement"}
          </button>
        </div>

        {/* 🧠 Loading Message */}
        {loading && (
          <p className="text-center mt-[2rem] lg:mt-[2%] animate-pulse text-gray-700">
            Nous analysons les couleurs et le style de votre article afin de vous
            suggérer des vêtements assortis.
          </p>
        )}
      </div>
    </form>
  );
};

export default UploadAnImage;
