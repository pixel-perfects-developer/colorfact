"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import FormSelect from "../FormSelect";
import { ArrowRightIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { getAllTendencies } from "@/api/tendencies";
import { setTendances, setSelectedTendance } from "@/redux/slices/tendencies";

const slugify = (text) =>
  text
    ?.toLowerCase()
    .replace(/\d+/g, "")       // numbers remove
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
const normalizeTendency = (item) => ({
    product_id: item.id,
    title: item.title ?? item.name,
    category: item.category,
    mainImage: item.mainImage ?? item.image_url_1,
    subtitle: item.subtitle ?? item.shortIntro ?? "",
    authorName: item.author?.name ?? item.authorName ?? "—",
    author: { name: item.author?.name ?? item.authorName ?? "—" },
    shortIntro: item.shortIntro ?? item.subtitle ?? "",
    createdAt: item.createdAt ?? new Date().toISOString(),
    slug:slugify(item.title),
    tags: item.tags ?? [],
    content: item.content ?? "",
});

const TrendingTabs = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("");
    const [open, setOpen] = useState(false);
    const [trends, setTrends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const openDropdownRef = useRef(null);

    useEffect(() => {
        const fetchTendencies = async () => {
            try {
                setIsLoading(true);
                setIsError(false);
  const data = await getAllTendencies();

const raw = data?.tendances ?? (Array.isArray(data) ? data : []);

const normalizedList = raw.map(normalizeTendency);

setTrends(normalizedList); // ⭐ missing line
dispatch(setTendances(normalizedList));
            } catch (err) {
                console.error("❌ Failed to fetch tendencies:", err);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTendencies();
    }, [dispatch]);

const categories = useMemo(() => {
  const allTags = trends.flatMap((item) => item.tags ?? []);

  return [...new Set(allTags)];
}, [trends]);
    useEffect(() => {
        if (categories.length > 0 && !activeTab) {
            setActiveTab(categories[0]);
        }
    }, [categories, activeTab]);

const filteredTendencies = useMemo(
  () => trends.filter((item) => item.tags?.includes(activeTab)),
  [trends, activeTab]
);

    const handleSelectChange = (value) => {
        setActiveTab(value);
        setOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!openDropdownRef.current) return;
            if (openDropdownRef.current.contains(e.target)) return;
            setOpen(false);
        };
        document.addEventListener("pointerdown", handleClickOutside);
        return () => document.removeEventListener("pointerdown", handleClickOutside);
    }, []);
if (isLoading) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#2F3E8F] animate-spin" />
      </div>
      <p className="mt-4 text-sm text-gray-500">Chargement des tendances...</p>
    </div>
  );
}
    if (isError) {
        return (
            <div className="py-10 text-center text-gray-500">
                <p>Impossible de charger les tendances. Veuillez réessayer.</p>
            </div>
        );
    }

    return (
        <div>
            {/* DESKTOP TABS */}
            <div className="hidden lg:flex flex-wrap gap-4 justify-center items-center sticky top-[8%] bg-[#F9F3E9] py-[2%]">
                {categories.map((cat,index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(cat)}
                        className={activeTab === cat ? "btn-blue capitalize"  : "btn-white capitalize"}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* MOBILE DROPDOWN */}
            <div
                className="block lg:hidden mt-[1rem] w-full sticky z-20 top-24"
                ref={openDropdownRef}
            >
                <FormSelect
                    isBlueDropdown={true}
                    open={open}
                    ref={openDropdownRef}
                    setOpen={setOpen}
                    selectedLabel="Sélectionner le type de vêtement"
                    MainService={categories}
                    handleSelectChange={handleSelectChange}
                    selectedCategory={activeTab}
                />
            </div>

            {/* TENDENCIES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                {filteredTendencies.length === 0 ? (
                    <div className="col-span-3 py-10 text-center text-gray-400">
                        <p>Aucune tendance disponible dans cette catégorie.</p>
                    </div>
                ) : (
                    filteredTendencies.map((item) => (
                        <Link
                            href={`/tendances/${item.slug }`}
                            key={item.product_id}
                            onClick={() => dispatch(setSelectedTendance(item))}
                            className="lg:mt-[4%] flex flex-row items-start gap-x-[1rem] p-[0.5rem] lg:p-0 lg:flex-col lg:rounded-lg overflow-hidden border-b lg:border-gray-300 lg:border lg:border-gray-200 lg:bg-white lg:shadow-sm hover:shadow-lg transition cursor-pointer"
                        >
                            <Image
                                src={item.mainImage}
                                alt={item.title}
                                width={400}
                                height={400}
                                className="w-[6rem] lg:w-full h-[6rem] 2xl:h-[16rem] lg:h-[16vw] object-cover rounded-md lg:rounded-none"
                            />
                            <div className="flex flex-col h-full relative lg:p-[4%]">
                                <h4 className="mb-[1%]">{item.title}</h4>
                                <p className="md:h-[4rem] lg:h-[5.5vw] 2xl:h-[6.5rem]">
                                    {item.subtitle?.slice(0, 80)}
                                </p>
                                <div className="flex justify-between">
                                    <div>
                                        <h6 className="my-[0.5rem] lg:my-[2%]">
                                            PAR{" "}
                                            <span style={{ color: "#F16935" }}>
                                                {item.authorName}
                                            </span>
                                        </h6>
                                        <p>
                                            {new Date(item.createdAt).toLocaleDateString("fr-FR", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="mt-auto flex lg:hidden justify-end pt-[0.5rem]">
                                        <ArrowRightIcon className="size-4 text-black" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default TrendingTabs;