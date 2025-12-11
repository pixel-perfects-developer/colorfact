"use client";
import { useSearchParams } from "next/navigation";
import ProductPage from "@/components/PrductPage";
import OutfitFilterPage from "@/components/OutfitFilterUI";

export default function ArticlesPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return <>{id ? <ProductPage id={id} /> : <OutfitFilterPage />}</>;
}
