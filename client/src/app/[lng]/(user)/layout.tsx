import Header from "@/components/Header";
import Providers from "@/app/[lng]/(user)/providers";

export default function Layout({children}: { children: React.ReactNode }) {

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