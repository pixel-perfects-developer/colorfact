"use client";

import React, { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import DashboardHeader from "../Header";

/* ---------------- EDITOR TOOLBAR ---------------- */
const EditorToolbar = ({ editor }) => {
  if (!editor) return null;

  // ✅ This makes the component re-render when selection/format changes
  useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      bullet: editor.isActive("bulletList"),
      h2: editor.isActive("heading", { level: 2 }),
    }),
  });

  const btn = (active) =>
    `
    px-3 py-2 rounded-md text-sm font-semibold transition-all border
    ${active
      ? "bg-[#446dbc] text-white border-[#446dbc] shadow-sm"
      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"}
  `;

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-[#f9f9fb] border-b border-gray-200">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btn(editor.isActive("bold"))}
      >
        <b>B</b>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btn(editor.isActive("italic"))}
      >
        <i>I</i>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btn(editor.isActive("underline"))}
      >
        <u>U</u>
      </button>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleBulletList().run()
        }
        className={btn(editor.isActive("bulletList"))}
      >
        • List
      </button>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        className={btn(editor.isActive("heading", { level: 2 }))}
      >
        H2
      </button>
    </div>
  );
};


export default function ManageTrends() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Select");
  const [isOn, setIsOn] = useState(false);
  const dropdownRef = useRef(null);

  const options = ["Fashion", "Style", "Travel", "Tech"];


  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        horizontalRule: false, // ❌ DISABLE HR COMPLETELY
      }),
      Underline,
      Image,
      Link,
    ],
    content: "<p>Start writing your article here…</p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        spellcheck: "false",
      },
    },
  });

  const handleToggle = () => setIsOn((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full min-h-screen p-[4%] lg:p-[2%] bg-[#faf5e7] font-sans">
      <DashboardHeader heading="Manage Trends" />

      <section className="w-full pb-10 border-b border-b-[#d0d0d0]">
        <h4 className="mb-6 text-black text-lg">Add Trend Article</h4>

        <form className="space-y-6">
          {/* TITLE */}
          <div>
            <h6 className="mb-2 text-black">Title</h6>
            <input className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#446dbc]" />
          </div>

          {/* SUBTITLE */}
          <div>
            <h6 className="mb-2 text-black">
              Sub-title / Short Intro
            </h6>
            <input className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#446dbc]" />
          </div>

          {/* ARTICLE CONTENT */}
          <div>
            <h6 className="mb-2 text-black">Article Content</h6>

            <div className="border border-gray-300 rounded-md bg-white shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-[#446dbc]">
              <EditorToolbar editor={editor} />
              <EditorContent
                editor={editor}
                className="
    prose prose-sm max-w-none
    min-h-[260px]
    px-4 py-3
    focus:outline-none
  "
              />

            </div>
          </div>

          {/* CATEGORY & TAGS */}
          <div className="flex flex-col md:flex-row gap-4">
            <div
              className="w-full md:w-1/2 relative"
              ref={dropdownRef}
            >
              <h6 className="mb-2 text-black">Category</h6>
              <div
                onClick={() => setOpen(!open)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md flex justify-between items-center cursor-pointer"
              >
                <span>{selected}</span>
                <span
                  className={`transition-transform ${open ? "rotate-180" : ""
                    }`}
                >
                  ⌄
                </span>
              </div>

              {open && (
                <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded-md shadow-md z-20">
                  {options.map((option) => (
                    <li
                      key={option}
                      onClick={() => {
                        setSelected(option);
                        setOpen(false);
                      }}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="w-full md:w-1/2">
              <h6 className="mb-2 text-black">Tags</h6>
              <input className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#446dbc]" />
            </div>
          </div>

          {/* IMAGE & PUBLISH */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              <h6 className="mb-2 text-black">Image</h6>
              <div className="flex bg-white border border-gray-300 rounded-md">
                <input
                  className="flex-1 px-3 py-2"
                  placeholder="Upload"
                  readOnly
                />
                <button
                  type="button"
                  className="px-4 bg-gray-100 hover:bg-gray-200"
                >
                  Browse
                </button>
              </div>
            </div>

             <div className="flex flex-col">
              <h6 className="text-gray-800 mb-3">Publish</h6>

              <div
                onClick={handleToggle}
                className={`w-14 h-7 flex items-center rounded-full cursor-pointer transition-colors duration-300 ${isOn ? "bg-[#446dbc]" : "bg-gray-300"
                  }`}
              >
                <div
                  className={`h-6 w-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isOn ? "translate-x-7" : "translate-x-1"
                    }`}
                />
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
