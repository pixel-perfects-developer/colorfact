import OurHistory from "@/components/Notre Histoire/OurHistory";
import data from "@/data/historydata.json";

export default function History() {
  const historyData = data.our_history;

  return (
    <>
      <OurHistory data={historyData} />
    </>
  );
}
