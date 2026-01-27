import OurHistory from "@/components/Notre Histoire/OurHistory";
import data from "@/data/termsdata.json";

export default function ConditionsDutilisation() {
  const historyData = data?.terms_condition;

  return (
    <>
      <OurHistory data={historyData} />
    </>
  );
}
