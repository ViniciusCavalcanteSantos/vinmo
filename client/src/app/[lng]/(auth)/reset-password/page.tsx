import {Suspense} from "react";
import Fallback from "@/components/Fallback";
import ResetPasswordForm from "@/components/Auth/ResetPasswordForm";

export default function Page() {
  return (
    <Suspense fallback={<Fallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

