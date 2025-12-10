// app/tendencias/[trendingDetail]/page.js
import trendingData from "@/app/trendingDummyData.json";
import { Circle } from "lucide-react";
import Image from "next/image";



  const slugify = (text) =>
    text
      ?.toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

export function generateStaticParams() {

  if (!trendingData?.trends) return [];

  return trendingData.trends.map((item) => ({
    trendingDetail: slugify(item.title),
  }));
}

export default async function TrendingDetailPage({ params }) {
  const { trendingDetail } = await params;
  const article = trendingData?.trends?.find((item) => slugify(item.title) === trendingDetail);
  if (!article) {
    return <div>Artículo no encontrado</div>;
  }
console.log("article",article);

  return (
    <section className="bg-[#F9F3E9]">

<div className=" min-h-[calc(100vh-264.61px)] md:min-h-[calc(100vh-237.27px)] lg:min-h-[calc(100vh-130px)] xl:min-h-[calc(100vh-147.09px)]  2xl:min-h-[calc(100vh-163px)]">
  {/* LEFT: IMAGE */}
  <div className="bg-[#faf5e744] container-global items-center flex-col lg:flex-row flex justify-between gap-x-[6%]">
  <div className="w-full lg:w-1/2">
    <Image
      src={article.mainImage}
      width={800}
      height={600}
      alt={article.title}
      className="w-full h-auto rounded-lg object-cover"
    />
  </div>

  {/* RIGHT: CONTENT */}
  <div className="w-full lg:w-1/2 flex flex-col gap-[0.5rem] lg:gap-4 mt-[1rem] lg:mt-0">
    {/* Category */}
    <p className=" text-pink-600 font-medium">
      {article.category}
    </p>

    {/* Title */}
    <h1 >
      {article.title}
    </h1>

    {/* Subtitle */}
    <p >
      {article.subtitle}
    </p>

    {/* Author + Date */}
    <div className="flex items-center gap-x-3 ">
              <h6 >BY  <span style={{color:"#F16935"}}>{article.authorName}</span></h6>
<p className="flex items-center gap-x-2 text-gray-600">
  <svg width="10" height="10" viewBox="0 0 10 10">
    <circle cx="5" cy="5" r="5" fill="#F16935" stroke="none" />
  </svg>

  {new Date(article.createdAt).toLocaleDateString("es-ES")}
</p>
    </div>

    {/* Content */}
    <p >
      {article.content}
    </p>

    {/* Tags */}
    <div className="flex flex-wrap gap-x-[2%]">
      {article.tags?.map((tag) => (
        <p
          key={tag}
        >
          #{tag}
        </p>
      ))}
    </div>
  </div>
  </div>

</div>
</section>

  );
}
