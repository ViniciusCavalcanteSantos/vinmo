import createPageMetadata from "@/lib/createPageMetadata";
import {Metadata, ResolvingMetadata} from "next";
import Address from "@/components/features/auth/Address";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return createPageMetadata(
    {path: "signup/address", titleKey: "seo.address.title", descriptionKey: "seo.address.description"},
    parent
  );
}

export default function Page() {
  return <Address/>
}
