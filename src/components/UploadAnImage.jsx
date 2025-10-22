"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import DropDownMenu from "./DropDownMenu";
import { outfitByColor } from "../../api/outfit_by_color";
import { extractColors } from "../../api/extract_colors";

const UploadAnImage = () => {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🧩 Formik setup
  const formik = useFormik({
    initialValues: {
      file: null,
      colorCode: "",
      gender: "",
      category: "",
      subcategory: "",
    },
    validationSchema: Yup.object({
      file: Yup.mixed().required("Please upload an image"),
      gender: Yup.string().required("Select a gender"),
      category: Yup.string().required("Select a category"),
    }),
    onSubmit: async (values) => {
      if (!values.colorCode) {
        alert("No color extracted from image");
        return;
      }

      try {
        setLoading(true);
        const response = await outfitByColor({
          color: values.colorCode,
          clothing_type: values.subcategory || values.category,
          gender:
            values.gender === "Homme"
              ? "H"
              : values.gender === "Femme"
              ? "F"
              : "H/F",
        });

        console.log("Recommended outfits:", response);
        alert("Outfit analysis complete! Check console for results.");
      } catch (err) {
        console.error("Error analyzing outfit:", err);
        alert("Failed to fetch outfit recommendations.");
      } finally {
        setLoading(false);
      }
    },
  });

  // 🖼 Handle file selection or drag-drop
  const handleFileSelect = async (file) => {
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    formik.setFieldValue("file", file);

    try {
      setLoading(true);
  const colorHex = await extractColors(file);
const cleanColor = colorHex.replace("#", "");
formik.setFieldValue("colorCode", cleanColor);
console.log("✅ Extracted color:", cleanColor);
    } catch (err) {
      console.error("Color extraction failed:", err);
      alert("Failed to extract color from image");
    } finally {
      setLoading(false);
    }
  };

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
  const handleDropdownSelect = ({ gender, category, subcategory }) => {
    formik.setFieldValue("gender", gender);
    formik.setFieldValue("category", category);
    formik.setFieldValue("subcategory", subcategory);
  };

  const analyzeDisabled =
    !formik.values.file || !formik.values.gender || !formik.values.category;

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-[#faf5e7]"
      encType="multipart/form-data"
    >
      <div className="container-global lg:w-[70%] mx-auto min-h-[clamp(32rem,79vh,50rem)] flex flex-col items-center justify-center">
        {/* 🖼 Upload Area */}
        <div
          className={`border-2 border-dashed rounded-[1vw] py-[3%] mb-[2%] w-full cursor-pointer transition-colors ${
            loading
              ? "border-orange-400 opacity-60"
              : "border-gray-400 hover:border-orange-400"
          }`}
          onClick={() => !loading && fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex justify-center">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="uploaded-garment"
                width={400}
                height={400}
                className="w-[60%] md:w-[30%] lg:w-[20%]"
              />
            ) : (
              <Image
                src="/drag-drop.png"
                alt="drag-drop-upload"
                width={400}
                height={400}
                className="w-[60%] md:w-[30%] lg:w-[20%]"
              />
            )}
          </div>
          <p className="text-center mt-[2rem] lg:mt-[2%] w-[80%] lg:w-[40%] mx-auto text-gray-700">
            {!imagePreview &&
              "Drag-and-drop a photo of your favorite garment and discover what to pair it with!"}
          </p>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* ⚠️ Error Display */}
        {formik.touched.file && formik.errors.file && (
          <p className="text-red-500 text-sm mb-2">{formik.errors.file}</p>
        )}

        {/* 🔸 Dropdown Section */}
        <DropDownMenu onSelect={handleDropdownSelect} />

        {/* ⚠️ Dropdown Errors */}
        {formik.touched.gender && formik.errors.gender && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.gender}</p>
        )}
        {formik.touched.category && formik.errors.category && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.category}</p>
        )}

        {/* 🔘 CTA */}
        <div className="flex justify-center mt-[2rem] lg:mt-[2%]">
          <button
            type="submit"
            disabled={analyzeDisabled || loading}
            className={`btn-orange ${
              (analyzeDisabled || loading) && "opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? "Analyzing..." : "Analyser mon vêtement"}
          </button>
        </div>

        {/* 🧠 Info Text */}
        <p className="text-center mt-[2rem] lg:mt-[2%]">
          Nous analysons les couleurs et le style de votre article afin de vous
          suggérer des vêtements assortis.
        </p>
      </div>
    </form>
  );
};

export default UploadAnImage;
