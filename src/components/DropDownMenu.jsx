"use client";
import React, { useEffect, useRef, useState } from "react";
import FormSelect from "./FormSelect";

const DropDownMenu = ({ onSelect }) => {
  const genderRef = useRef(null);
  const categoryRef = useRef(null);
  const subcategoryRef = useRef(null);

  const [dropdowns, setDropdowns] = useState({
    gender: { open: false, selected: null },
    category: { open: false, selected: null },
    subcategory: { open: false, selected: null },
  });

  // 🧥 Clothing Categories (new data structure)
  const Categories = {
    "Casual été": ["T-shirt", "Jean", "Pantalon", "Casquette"],
    "Casual hiver": ["Hoodie", "Pull", "Doudoune", "Manteau", "Bonnet", "Pantalon"],
    "Sportswear": ["Jogging", "Hoodie", "Sac à dos", "Casquette"],
    "Professionnel": ["Pantalon habillé", "Blazer", "Chemise", "Ceinture"],
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

  // 🔁 Whenever gender or category/subcategory changes
  useEffect(() => {
    if (onSelect) {
      onSelect({
        gender:
          dropdowns.gender.selected?.name || dropdowns.gender.selected || "",
        subcategory:
          dropdowns.subcategory.selected?.name ||
          dropdowns.subcategory.selected ||
          "",
      });
    }
  }, [
    dropdowns.gender.selected,
    dropdowns.category.selected,
    dropdowns.subcategory.selected,
  ]);

  // 🧹 Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        genderRef.current?.contains(e.target) ||
        categoryRef.current?.contains(e.target) ||
        subcategoryRef.current?.contains(e.target)
      )
        return;
      setDropdowns((prev) => ({
        ...prev,
        gender: { ...prev.gender, open: false },
        category: { ...prev.category, open: false },
        subcategory: { ...prev.subcategory, open: false },
      }));
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateDropdown = (key, updates) => {
    setDropdowns((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...updates },
    }));
  };

  return (
    <>
      {/* 👕 Gender Selector */}
      <FormSelect
        ref={genderRef}
        open={dropdowns.gender.open}
        setOpen={(val) => updateDropdown("gender", { open: val })}
        selectedLabel="Select Gender"
        MainService={Gender}
        handleSelectChange={(val) =>
          updateDropdown("gender", { selected: val, open: false })
        }
        selectedCategory={dropdowns.gender.selected}
      />

      {/* 🧥 Category Selector */}
      <FormSelect
        ref={categoryRef}
        open={dropdowns.category.open}
        setOpen={(val) => updateDropdown("category", { open: val })}
        selectedLabel="Select Category"
        MainService={availableCategories.map((name, i) => ({ id: i, name }))}
        handleSelectChange={(val) => {
          updateDropdown("category", {
            selected: val,
            open: false,
          });
          updateDropdown("subcategory", { selected: null }); // reset subcategory
        }}
        selectedCategory={dropdowns.category.selected}
      />

      {/* 👖 Subcategory Selector */}
      {dropdowns.category.selected && (
        <FormSelect
          ref={subcategoryRef}
          open={dropdowns.subcategory.open}
          setOpen={(val) => updateDropdown("subcategory", { open: val })}
          selectedLabel="Select Clothing Type"
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
