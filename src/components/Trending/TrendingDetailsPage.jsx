"use client";

import TrendingDrawerMobile from "@/components/Trending/TrendingDrawerMobile";
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllTendencies } from "@/api/tendencies";
import { setTendances } from "@/redux/slices/tendencies";

const slugify = (text) =>
  text
    ?.toLowerCase()
    .replace(/\d+/g, "")       // numbers remove
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
function MostRead({ mostRead }) {
    return (
        <>
            <h3 className="text-lg font-semibold">Les plus lus</h3>
            <div className="mt-[2%] border-t border-black">
                {mostRead.map((item, index) => (
                    <Link key={index} href={`/tendances/${item.slug}`}>
                        <div className="py-6 border-b border-gray-300 flex gap-4 cursor-pointer">
                            <Image
                                src={item.mainImage}
                                width={400}
                                height={400}
                                className="w-20 h-20 object-cover"
                                alt={item.title}
                            />
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-500">
                                    {item.category}
                                </p>
                                <p className="font-semibold text-sm">{item.title}</p>
                                <p className="text-xs uppercase tracking-wide mt-2">
                                    PAR {item.author?.name ?? item.authorName}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
}


export default function TrendingDetailPage({tendancesList}) {
  const params = useParams();
  const slug = params?.detail ?? "";

  const article = tendancesList?.find(
    (item) =>
      item.slug === slug ||
      slugify(item.title) === slug ||
      item.product_id === slug
  );

  if (!article) {
    return (
      <section className="bg-[#F9F3E9]">
        <div className="container-global min-h-[60vh] flex items-center justify-center">
          <p>Tendance introuvable</p>
        </div>
      </section>
    );
  }

  const mostRead = tendancesList
    ?.filter(
      (item) =>
        item.category === article.category &&
        item.product_id !== article.product_id &&
        item.slug !== article.slug
    )
    .slice(0, 3);

    return (
        <section className="bg-[#F9F3E9]">
            <div className="container-global min-h-[calc(100vh-264.61px)] md:min-h-[calc(100vh-237.27px)] lg:min-h-[calc(100vh-130px)] xl:min-h-[calc(100vh-147.09px)] 2xl:min-h-[calc(100vh-163px)]">

                <div className="items-center flex-col-reverse md:flex-row flex justify-between gap-x-[6%]">
                    {/* LEFT: IMAGE */}
                    <div className="w-full md:w-[47%] mt-[1rem] lg:mt-0">
                        <Image
                            src={article.mainImage}
                            width={800}
                            height={600}
                            alt={article.title}
                            className="w-full h-auto rounded-lg object-cover"
                        />
                    </div>

                    {/* RIGHT: CONTENT */}
                    <div className="text-center md:text-left md:w-[47%] flex flex-col gap-[0.5rem] lg:gap-4 mt-[1rem] lg:mt-0">
                        <p className="text-pink-600 font-medium">{article.category}</p>

                        <h1>{article.title}</h1>

                        <p>{article.shortIntro ?? article.subtitle}</p>

                        <div className="flex justify-center md:justify-start items-center gap-x-3">
                            <h6>
                                PAR{" "}
                                <span style={{ color: "#F16935" }}>
                                    {article.author?.name ?? article.authorName}
                                </span>
                            </h6>
                            <p className="flex items-center gap-x-2 text-gray-600">
                                <svg width="10" height="10" viewBox="0 0 10 10">
                                    <circle cx="5" cy="5" r="5" fill="#F16935" stroke="none" />
                                </svg>
                                {article.createdAt
                                    ? new Date(article.createdAt).toLocaleDateString("fr-FR")
                                    : "—"}
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-x-[2%]">
                            {article.tags?.map((tag) => (
                                <p key={tag}>#{tag}</p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CONTENT SECTION */}
                <div className="flex items-start justify-between">
                    <div
                        className="w-[85%] md:w-[90%] lg:w-[67%] mt-[2%] rich-content"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {mostRead?.length > 0 && (
                        <div className="w-[26%] sticky top-[14%] mt-[1%] hidden lg:block">
                            <MostRead mostRead={mostRead} />
                        </div>
                    )}

                    {mostRead?.length > 0 && (
                        <div className="lg:hidden w-[7.9%] md:w-[5%] z-40 sticky mt-[1rem] top-[12%] md:top-[10%]">
                            <TrendingDrawerMobile mostRead={mostRead} />
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}