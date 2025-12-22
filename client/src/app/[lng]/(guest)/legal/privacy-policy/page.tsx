import PrivacyPolicy from "@/components/features/guest/Legal/PrivacyPolicy";
import {Metadata, ResolvingMetadata} from "next";
import createPageMetadata from "@/lib/createPageMetadata";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return createPageMetadata(
    {
      path: "legal/privacy-policy",
      titleKey: "legal:seo.privacy_policy.title",
      descriptionKey: "legal:seo.privacy_policy.description"
    },
    parent
  );
}

export default function Page() {
  return <PrivacyPolicy/>
}
