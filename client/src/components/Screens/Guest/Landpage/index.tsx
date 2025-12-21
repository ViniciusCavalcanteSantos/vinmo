import GuestHeader from "@/components/Screens/Guest/GuestHeader";
import Fallback from "@/components/Fallback";

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

