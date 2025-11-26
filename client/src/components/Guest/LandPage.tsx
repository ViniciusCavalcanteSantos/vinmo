import LandingPageHeader from "@/components/Guest/LandPageHeader";
import Fallback from "@/components/Fallback";

export default function LandPage() {
  return (
    <div className='h-[300vh]'>
      <LandingPageHeader/>

      <main className="pt-16">
        <Fallback/>
      </main>
    </div>
  )
}

