import SignupForm from "@/components/Auth/SignupForm";
import createPageMetadata from "@/lib/createPageMetadata";
import {Metadata, ResolvingMetadata} from "next";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return createPageMetadata(
    { path: "signup", titleKey: "seo.signup.title", descriptionKey: "seo.signup.description" },
    parent
  );
}

export default function Page() {
  return <SignupForm/>
}
