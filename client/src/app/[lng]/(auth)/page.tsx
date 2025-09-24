import SigninForm from "@/components/Auth/SigninForm";
import createPageMetadata from "@/lib/createPageMetadata";
import {Metadata, ResolvingMetadata} from "next";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return createPageMetadata(
    { path: "signin", titleKey: "seo.signin.title", descriptionKey: "seo.signin.description" },
    parent
  );
}

export default function Page() {
  return <SigninForm />
}
