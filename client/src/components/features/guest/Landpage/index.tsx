import GuestHeader from "@/components/common/layout/GuestHeader";
import LandPage from "@/components/features/guest/Landpage/LandPage";

export default function Index() {
  return (
    <div className='h-[300vh]'>
      <GuestHeader/>

      <main className="pt-16">
        <LandPage/>

      </main>
    </div>
  )
}

