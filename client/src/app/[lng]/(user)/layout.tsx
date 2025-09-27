import Header from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {

  return(
    <div>
      <Header />

      <main className="p-6 lg:px-8 mx-auto max-w-7xl flex flex-col">
        {children}
      </main>
    </div>
  )
}