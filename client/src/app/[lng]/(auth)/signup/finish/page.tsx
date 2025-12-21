import FinishForm from "@/components/features/auth/FinishForm";
import createPageMetadata from "@/lib/createPageMetadata";
import {Metadata, ResolvingMetadata} from "next";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return createPageMetadata(
    {path: "signup/finish", titleKey: "seo.finish.title", descriptionKey: "seo.finish.description"},
    parent
  );
}

export default function Page() {
  return <FinishForm/>
}
