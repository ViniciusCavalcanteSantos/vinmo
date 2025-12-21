import ForgotPasswordForm from "@/components/features/auth/ForgotPasswordForm";
import createPageMetadata from "@/lib/createPageMetadata";
import {Metadata, ResolvingMetadata} from "next";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return createPageMetadata(
    {path: "forgot-password", titleKey: "seo.forgot_password.title", descriptionKey: "seo.forgot_password.description"},
    parent
  );
}

export default function Page() {
  return <ForgotPasswordForm/>
}
