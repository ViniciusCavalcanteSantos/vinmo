import Fallback from "@/components/ui/Fallback";
import GuestHeader from "@/components/common/layout/GuestHeader";

export default function Landpage() {
  return (
    <div className='h-[300vh]'>
      <GuestHeader/>

      <main className="pt-16">
        <Fallback/>
      </main>
    </div>
  )
}

