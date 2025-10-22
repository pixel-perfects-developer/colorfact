"use client";
import React, { useEffect, useRef, useState } from "react";
import FormSelect from "./FormSelect";

const DropDownMenu = ({ onSelect }) => {
  const [dropdowns, setDropdowns] = useState({
    gender: { open: false, selected: null, ref: useRef(null) },
    category: { open: false, selected: null, ref: useRef(null) },
    subcategory: { open: false, selected: null, ref: useRef(null) },
  });

  const Categories = {
    Tops: ["T-shirt", "Polo", "Shirt", "Turtleneck", "Sweatshirt", "Hoodie", "Sweater", "Cardigan", "Jacket", "Windbreaker", "Coat", "Parka", "Trench coat"],
    Bottoms: ["Pants", "Jeans", "Shorts", "Jogging", "Chinos", "Skirts", "Dresses", "Jumpsuits"],
    "Dressy sets": ["Suit", "Dress pants", "Blazer", "Evening dress"],
    Shoes: ["Sneakers", "Boots", "Dress shoes", "Pumps", "Heels", "Sandals"],
    Accessories: ["Handbag", "Backpack", "Glasses", "Hats", "Beanie", "Caps", "Belt", "Watch"],
  };

  const Gender = [
    { id: 1, name: "Homme" },
    { id: 2, name: "Femme" },
    { id: 3, name: "Mixte" },
  ];

  const availableCategories = Object.keys(Categories);
  const availableSubCategories = dropdowns.category.selected
    ? Categories[
        dropdowns.category.selected.name || dropdowns.category.selected
      ]
    : [];

  // ✅ Notify parent AFTER state changes
  useEffect(() => {
    if (onSelect) {
      onSelect({
        gender:
          dropdowns.gender.selected?.name ||
          dropdowns.gender.selected ||
          null,
        category:
          dropdowns.category.selected?.name ||
          dropdowns.category.selected ||
          null,
        subcategory:
          dropdowns.subcategory.selected?.name ||
          dropdowns.subcategory.selected ||
          null,
      });
    }
  }, [
    dropdowns.gender.selected,
    dropdowns.category.selected,
    dropdowns.subcategory.selected,
  ]);

  // 🔹 Outside click to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      setDropdowns((prev) => {
        const newState = { ...prev };
        Object.keys(newState).forEach((key) => {
          if (
            newState[key].ref.current &&
            !newState[key].ref.current.contains(e.target)
          ) {
            newState[key].open = false;
          }
        });
        return newState;
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🧩 Safe update
  const updateDropdown = (key, updates) => {
    setDropdowns((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...updates },
    }));
  };

  return (
    <>
      <FormSelect
        ref={dropdowns.gender.ref}
        open={dropdowns.gender.open}
        setOpen={(val) => updateDropdown("gender", { open: val })}
        selectedLabel="Select Gender"
        MainService={Gender}
        handleSelectChange={(val) =>
          updateDropdown("gender", { selected: val, open: false })
        }
        selectedCategory={dropdowns.gender.selected}
      />

      <FormSelect
        ref={dropdowns.category.ref}
        open={dropdowns.category.open}
        setOpen={(val) => updateDropdown("category", { open: val })}
        selectedLabel="Select Category"
        MainService={availableCategories.map((name, i) => ({ id: i, name }))}
        handleSelectChange={(val) =>
          updateDropdown("category", { selected: val, open: false })
        }
        selectedCategory={dropdowns.category.selected}
      />

      {dropdowns.category.selected && (
        <FormSelect
          ref={dropdowns.subcategory.ref}
          open={dropdowns.subcategory.open}
          setOpen={(val) => updateDropdown("subcategory", { open: val })}
          selectedLabel="Select Subcategory"
          MainService={availableSubCategories.map((name, i) => ({
            id: i,
            name,
          }))}
          handleSelectChange={(val) =>
            updateDropdown("subcategory", { selected: val, open: false })
          }
          selectedCategory={dropdowns.subcategory.selected}
        />
      )}
    </>
  );
};

export default DropDownMenu;
