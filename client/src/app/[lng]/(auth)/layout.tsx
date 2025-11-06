import {PropsWithChildren} from "react";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

export default async function Layout({children}: PropsWithChildren) {
  const cookieStore = await cookies();
  const loggedIn = !!cookieStore.get('logged_in')?.value;

  if (loggedIn) {
    redirect(`/home`);
  }
  
  return (
    <div className="h-full flex justify-center items-center bg-background">
      {children}
    </div>
  );
}