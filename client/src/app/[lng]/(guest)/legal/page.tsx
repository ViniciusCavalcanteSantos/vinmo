import LegalHubPage from "@/components/features/guest/Legal/LegalHubPage";
import {Metadata, ResolvingMetadata} from "next";
import createPageMetadata from "@/lib/createPageMetadata";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return createPageMetadata(
    {
      path: "legal",
      titleKey: "seo.legal_hub.title",
      descriptionKey: "seo.legal_hub.description"
    },
    parent
  );
}

export default function Page() {
  return <LegalHubPage/>
}
