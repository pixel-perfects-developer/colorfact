import { getAllTendencies } from "@/api/tendencies";
import TrendingDetailPage from "@/components/Trending/TrendingDetailsPage";


const slugify = (text) =>
  text
    ?.toLowerCase()
    .replace(/\d+/g, "")       // numbers remove
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
export async function generateStaticParams() {
  const data = await getAllTendencies();

  return (data?.tendances || []).map((item) => ({
    detail: slugify(item.title) , 
  }));
}

export default async function Page({ params }) {
  const data = await getAllTendencies();

  return (
    <TrendingDetailPage
      tendancesList={data?.tendances ?? []}
    />
  );
}