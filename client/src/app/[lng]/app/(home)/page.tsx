import createPageMetadata from "@/lib/createPageMetadata";
import {Metadata, ResolvingMetadata} from "next";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return createPageMetadata(
    {
      path: "app",
      titleKey: "seo.dashboard.title",
      descriptionKey: "seo.dashboard.description",
      isAppRoute: true,
      robots: {index: false, follow: false}
    },
    parent
  );
}

export default function Page() {
  return (
    <>
      Home
    </>
  );
}
