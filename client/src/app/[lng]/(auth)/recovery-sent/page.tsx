import RecoverySentForm from "@/components/Auth/RecoverySentForm";
import createPageMetadata from "@/lib/createPageMetadata";
import {Metadata, ResolvingMetadata} from "next";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return createPageMetadata(
    { path: "recovery-sent", titleKey: "seo.recovery_sent.title", descriptionKey: "seo.recovery_sent.description" },
    parent
  );
}

export default function Page() {
  return <RecoverySentForm />
}
