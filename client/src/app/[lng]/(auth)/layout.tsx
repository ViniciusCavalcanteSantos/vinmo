import {PropsWithChildren} from "react";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import Providers from "@/app/[lng]/(auth)/providers";

export default async function Layout({children}: PropsWithChildren) {
  const cookieStore = await cookies();
  const loggedIn = !!cookieStore.get('logged_in')?.value;

  if (loggedIn) {
    redirect(`/home`);
  }

  return (
    <Providers>
      <div className="flex justify-center items-center py-16">
        {children}
      </div>
    </Providers>

  );
}