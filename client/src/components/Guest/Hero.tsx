import Image from "next/image";
import photographer from "@/assets/photographer.svg"

export default function Hero() {
  return(
    <div className="h-[80vh] flex justify-center">
      <div className="container items-center grid grid-cols-2">
        <div>
          <h2 className="text-lead-dark font-bold text-3xl">Entregue galerias personalizadas por reconhecimento facial em minutos.</h2>
          <p className="text-lead-dark">Lorem ipsum dolor sit amet. Et iure consequatur ex ipsum maxime est ducimus reiciendis. Eum harum labore aut magni dignissimos qui impedit tempora cum culpa similique quo quia tenetur. At velit quis id sint laudantium ut ipsum saepe? </p>
        </div>
        <picture>
          <Image src={photographer} alt="woman_taking_picture" width={300} className="scale-x-[-1]" />
        </picture>
      </div>
    </div>
  )
}

