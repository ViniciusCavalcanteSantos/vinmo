import TermsOfService from "@/components/features/guest/Legal/TermsOfService";
import {Metadata, ResolvingMetadata} from "next";
import createPageMetadata from "@/lib/createPageMetadata";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return createPageMetadata(
    {
      path: "legal/terms-of-service",
      titleKey: "seo.terms_of_service.title",
      descriptionKey: "seo.terms_of_service.description"
    },
    parent
  );
}

export default function Page() {
  return <TermsOfService/>
}
