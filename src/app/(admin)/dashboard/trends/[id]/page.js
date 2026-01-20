import { recentArticles } from "@/components/Dashboard/trends/DummyArticles";
import TrendingDrawerMobile from "@/components/Trending/TrendingDrawerMobile";
import Image from "next/image";
import Link from "next/link";

const slugify = (text) =>
  text
    ?.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

export function generateStaticParams() {
  if (!recentArticles) return [];

  return recentArticles.map((item) => ({
    trendingDetail: slugify(item.title),
  }));
}


function MostRead({ mostRead }) {
  return (
    <>
      <h3 className="text-lg font-semibold">Most Read</h3>

      <div className="mt-[2%] border-t border-black  h-[25rem] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">
        {mostRead.map((item,index) => (
          <Link key={index} href={`/tendances/${slugify(item.title)}`}>
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
                  BY {item.authorName}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
export default async function TrendingDetailPage({ params }) {
  const { id } = await params;
  const  trendingDetail = id;
  const article = recentArticles?.find(
    (item) => slugify(item.title) === trendingDetail
  );
  if (!article) {
    return <div>Artículo no encontrado</div>;
  }
  const mostRead = recentArticles
    ?.filter(
      (item) =>
        item.category === article.category &&
        slugify(item.title) !== trendingDetail
    )

  return (
<>
        <div className="items-center  flex-col-reverse md:flex-row flex justify-between gap-x-[6%]">
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
          <div className="text-center md:text-left  md:w-[47%] flex flex-col gap-[0.5rem] lg:gap-4 mt-[1rem] lg:mt-0">
            {/* Category */}
            <p className=" text-pink-600 font-medium">{article.category}</p>

            {/* Title */}
            <h1>{article.title}</h1>

            {/* Subtitle */}
            <p>{article.shortIntro}</p>

            {/* Author + Date */}
            <div className="flex justify-center md:justify-start items-center gap-x-3 ">
              <h6>
                BY{" "}
                <span style={{ color: "#F16935" }}>{article.author.name}</span>
              </h6>
              <p className="flex items-center gap-x-2 text-gray-600">
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <circle cx="5" cy="5" r="5" fill="#F16935" stroke="none" />
                </svg>

                {new Date(article.createdAt).toLocaleDateString("es-ES")}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center md:justify-start gap-x-[2%]">
              {article.tags?.map((tag) => (
                <p key={tag}>#{tag}</p>
              ))}
            </div>
          </div>
          </div>
          {/* CONTENT SECTION */}
          <div className="flex items-start justify-between">
          <p
            className="w-[85%] md:w-[90%] lg:w-[67%] mt-[2%] rich-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        {/* CLOSE FLEX CONTAINER */}
       {mostRead?.length>0 &&  <div className="w-[26%] sticky top-[14%] mt-[1%] hidden lg:block">
          <MostRead mostRead={mostRead} />
        </div>
        }
           {mostRead?.length>0 &&   <div className="lg:hidden w-[7.9%] md:w-[5%] z-40  sticky mt-[1rem]  top-[12%] md:top-[10%]">
          <TrendingDrawerMobile mostRead={mostRead} />
        </div>
            }
          </div>
</>
  );
}
