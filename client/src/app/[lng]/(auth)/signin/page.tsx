import {Metadata, ResolvingMetadata} from "next";
import createPageMetadata from "@/lib/createPageMetadata";
import SigninForm from "@/components/Screens/Auth/SigninForm";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return createPageMetadata(
    {path: "signin", titleKey: "seo.signin.title", descriptionKey: "seo.signin.description"},
    parent
  );
}

export default function Page() {
  return <SigninForm/>
}
