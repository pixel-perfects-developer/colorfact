import OurHistory from "@/components/Notre Histoire/OurHistory";
import data from "@/data/privacy.json";

export default function PrivacyPolicy() {
  const historyData = data?.privacy_policy;

  return (
    <>
      <OurHistory data={historyData} />
    </>
  );
}
