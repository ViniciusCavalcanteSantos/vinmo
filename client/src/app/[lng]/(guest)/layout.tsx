import {PropsWithChildren} from "react";
import Providers from "@/app/[lng]/(auth)/providers";

export default async function Layout({children}: PropsWithChildren) {
  return (
    <Providers>
      {children}
    </Providers>
  );
}