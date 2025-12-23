"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  HtmlEditor,
  Image,
  Inject,
  Link,
  QuickToolbar,
  RichTextEditorComponent,
  Toolbar
} from "@syncfusion/ej2-react-richtexteditor";
import DashboardHeader from "../Header";
import FormSelect from "@/components/FormSelect";
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-icons/styles/material.css';
import '@syncfusion/ej2-buttons/styles/material.css';
import '@syncfusion/ej2-splitbuttons/styles/material.css';
import '@syncfusion/ej2-inputs/styles/material.css';
import '@syncfusion/ej2-lists/styles/material.css';
import '@syncfusion/ej2-navigations/styles/material.css';
import '@syncfusion/ej2-popups/styles/material.css';
import '@syncfusion/ej2-richtexteditor/styles/material.css';

/* ---------------- EDITOR TOOLBAR ---------------- */


/* ---------------- MAIN PAGE ---------------- */
export default function ManageTrends() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Select Category");
  const [isOn, setIsOn] = useState(false);
  const dropdownRef = useRef(null);
  const editorRef = useRef(null);
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    // 🔹 Yahan future mein:
    // - upload to S3 / Firebase
    // - preview
    // - validation
  };
  const options = ["Fashion", "Style", "Travel", "Tech"];
  const toolbarSettings = {
    items: [
      "Bold", "Italic", "Underline", "StrikeThrough",
      "FontName", "FontSize", "FontColor", "BackgroundColor",
      "LowerCase", "UpperCase",
      "|",
      "Formats", "Alignments",
      "OrderedList", "UnorderedList",
      "|",
      "CreateLink", "Image",
      "|",
      "ClearFormat",
      "SourceCode",
      "Undo", "Redo"
    ]
  };


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current) return;
      if (dropdownRef.current.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, []);
  useEffect(() => {
    const hideSyncfusionTrialBanner = () => {
      const divs = document.querySelectorAll("div");

      divs.forEach((div) => {
        const text = div.innerText || "";
        const style = div.getAttribute("style") || "";

        // 🎯 EXACT MATCH CONDITIONS
        const isSyncfusionBanner =
          text.includes("trial version of Syncfusion") ||
          text.includes("Essential Studio") ||
          text.includes("Claim your free account") ||
          text.includes("Free and unlimited access to Syncfusion") ||
          (
            style.includes("position: fixed") &&
            style.includes("z-index: 999999999") &&
            style.includes("background: #EEF2FF")
          );

        if (isSyncfusionBanner) {
          div.style.display = "none";
          div.style.visibility = "hidden";
          div.style.height = "0";
          div.style.padding = "0";
          div.style.margin = "0";
        }
      });
    };

    // Initial run
    hideSyncfusionTrialBanner();

    // 🔥 Observe DOM (Syncfusion injects later)
    const observer = new MutationObserver(hideSyncfusionTrialBanner);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);
  return (
    <>
      <DashboardHeader heading="Manage Trends" />
      <section className="w-full border-b-2 border-[#d0d0d0] pb-[1rem] lg:pb-[2%]">
        <h4 className=" mb-[0.5rem] lg:mb-[1%]">Add Trend Article</h4>

        <form
          className="space-y-[1rem] lg:space-y-[1%]"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* TITLE */}
          <div>
            <h6 className=" mb-[0.5rem] lg:mb-[0.5%]">Title</h6>
            <input className="w-full px-[0.5rem] py-[0.7rem] lg:px-[1%] lg:py-[0.5%] text-[0.7rem] lg:text-[0.6vw] 2xl:text-[0.85rem] bg-white transition-all duration-300 rounded-md ring-2 ring-gray-300 focus:ring-[#F16935] outline-none" />
          </div>

          {/* SUBTITLE */}
          <div>
            <h6 className=" mb-[0.5rem] lg:mb-[0.5%]">Sub-title / Short Intro</h6>
            <input className="w-full  px-[0.5rem] py-[0.7rem] lg:px-[1%] lg:py-[0.5%] bg-white text-[0.7rem] lg:text-[0.6vw] 2xl:text-[0.85rem] transition-all duration-300 rounded-md ring-2 ring-gray-300 focus:ring-[#F16935] outline-none" />
          </div>

          {/* EDITOR */}
          <div>
            <h6 className=" mb-[0.5rem] lg:mb-[0.5%]">Article Content</h6>
            <div className="rounded-md overflow-hidden">
            <RichTextEditorComponent
            ref={editorRef}
            height={450}
            toolbarSettings={toolbarSettings}
          >
            <Inject services={[Toolbar, Image, Link, HtmlEditor, QuickToolbar]} />
          </RichTextEditorComponent>

            </div>
          </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          {/* CATEGORY */}
          <div ref={dropdownRef}>
            <h6 className=" mb-[0.5rem] lg:mb-[0.8%]">Category</h6>
            <FormSelect
              open={open}
              setOpen={setOpen}
              selectedLabel="Select Category"
              MainService={options.map((cat, i) => ({
                id: i,
                name: cat,
              }))}
              handleSelectChange={(v) => {
                setSelected(v);
                setOpen(false);
              }}
              selectedCategory={selected}
            />
          </div>
          <div>
            <h6 className="mb-[0.5rem] lg:mb-[1%]">Tags</h6>
            <input className="w-full  px-[0.8rem] py-[0.9rem] lg:px-[1%] text-[0.7rem] lg:text-[0.6vw] 2xl:text-[0.85rem] lg:py-[1.6%] transition-all duration-300 bg-white rounded-md ring-2 ring-gray-300 focus:ring-[#F16935] outline-none" />
          </div>
       </div>
       <div className="grid grid-cols-5 lg:grid-cols-2   gap-x-6 items-center">
          <div className=" col-span-4 lg:col-span-1">
            <h6 className="mb-[0.5rem] lg:mb-[1%]">Image</h6>
 <div className="w-full flex items-center  bg-white rounded-md ring-2 ring-gray-300  transition-all duration-300">

      {/* READ-ONLY INPUT (shows filename) */}
      <input
        type="text"
        placeholder="Upload image"
        value={fileName}
        readOnly
        className="flex-1 text-[0.7rem] lg:text-[0.6vw] 2xl:text-[0.85rem]  px-[0.5rem] py-[0.7rem] lg:px-[1%] lg:py-[0.5%] bg-transparent outline-none "
      />

      {/* HIDDEN FILE INPUT */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden className="text-[0.7rem] lg:text-[0.6vw] 2xl:text-[0.85rem]"
        onChange={handleFileChange}
      />

      {/* BROWSE BUTTON */}
      <button
        type="button"
        onClick={() => fileRef.current.click()}
        className="btn-gray"
      >
        Browse
      </button>
    </div>
              </div>
          {/* PUBLISH */}
          <div >
            <h6 className="mb-[0.5rem] lg:mb-[1%]">Publish</h6>
           <div
  onClick={() => setIsOn((p) => !p)}
  className={`relative w-14 h-7 rounded-full cursor-pointer
    transition-colors duration-300 ease-in-out
    ${isOn ? "bg-[#446dbc]" : "bg-gray-300"}
  `}
>
  <div
    className={`absolute top-0.5 left-0.5 h-6 w-6 bg-white rounded-full shadow-md
      transform transition-transform duration-300 ease-in-out
      ${isOn ? "translate-x-7" : "translate-x-0"}
    `}
  />
</div>

          </div>
          </div>
        </form>
      </section>
    </>
  );
}
