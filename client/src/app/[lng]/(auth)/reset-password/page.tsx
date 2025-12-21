import {Suspense} from "react";
import Fallback from "@/components/ui/Fallback";
import ResetPasswordForm from "@/components/features/auth/ResetPasswordForm";
import createPageMetadata from "@/lib/createPageMetadata";
import {Metadata, ResolvingMetadata} from "next";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return createPageMetadata(
    {path: "reset-password", titleKey: "seo.reset_password.title", descriptionKey: "seo.reset_password.description"},
    parent
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Fallback/>}>
      <ResetPasswordForm/>
    </Suspense>
  );
}

