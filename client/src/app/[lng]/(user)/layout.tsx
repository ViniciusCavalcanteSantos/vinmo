import Header from "@/components/Header";
import {fetchUserServer} from "@/lib/api/users/fetchUserServer";
import {redirect} from "next/navigation";

export default async function Layout({children}: { children: React.ReactNode }) {
  const {user} = await fetchUserServer()

  if (!user) {
    redirect(`/signin`);
  }

  return (
    <div>
      <Header/>

      <main className="p-6 lg:px-8 mx-auto max-w-7xl flex flex-col">
        {children}
      </main>
    </div>
  )
}