import Header from "@/components/Header";
import Providers from "@/app/[lng]/(user)/providers";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

export default async function Layout({children}: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const loggedIn = !!cookieStore.get('logged_in')?.value;

  if (!loggedIn) {
    redirect(`/signin`);
  }

  return (
    <Providers>
      <div>
        <Header/>

        <main className="p-6 lg:px-8 mx-auto max-w-7xl flex flex-col">
          {children}
        </main>
      </div>
    </Providers>
  )
}