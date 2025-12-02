import {PropsWithChildren} from "react";
import {redirect} from "next/navigation";
import Providers from "@/app/[lng]/(auth)/providers";
import {fetchUserServer} from "@/lib/api/users/fetchUserServer";

export default async function Layout({children}: PropsWithChildren) {
  const {user} = await fetchUserServer()

  if (user) {
    redirect(`/app`);
  }

  return (
    <Providers>
      <div className="flex justify-center items-center py-16">
        {children}
      </div>
    </Providers>

  );
}