import { getAllTendencies } from "@/api/tendencies";
import TrendingDetailPage from "@/components/Trending/TrendingDetailsPage";

export default async function Page() {

  const data = await getAllTendencies();

  return (
    <TrendingDetailPage
      tendancesList={data?.tendances ?? []}
    />
  );
}