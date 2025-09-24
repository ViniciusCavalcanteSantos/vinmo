import ConfirmCodeForm from "@/components/Auth/CofirmCodeForm";
import createPageMetadata from "@/lib/createPageMetadata";
import {Metadata, ResolvingMetadata} from "next";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return createPageMetadata(
    { path: "signup/confirm-code", titleKey: "seo.confirm_code.title", descriptionKey: "seo.confirm_code.description" },
    parent
  );
}

export default function Page() {
  return <ConfirmCodeForm />
}
