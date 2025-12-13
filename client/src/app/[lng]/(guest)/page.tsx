import createPageMetadata from "@/lib/createPageMetadata";
import {Metadata, ResolvingMetadata} from "next";
import LandPage from "@/components/Screens/Guest/LandPage";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return createPageMetadata(
    {path: "", titleKey: "seo.landpage.title", descriptionKey: "seo.landpage.description"},
    parent
  );
}

export default function Page() {
  return <LandPage/>
}
