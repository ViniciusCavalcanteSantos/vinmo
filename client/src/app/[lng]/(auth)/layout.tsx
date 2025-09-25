"use client"

import {PropsWithChildren, useEffect} from "react";
import {useRouter} from "next/navigation";

export default function Layout({children}: PropsWithChildren) {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token")
    if(token) router.push("/home")
  }, [])

  return (
    <div className="h-full flex justify-center items-center">
      <div className="w-100 bg-white px-10 py-8 rounded-sm shadow-[0_0_10px_rgba(0,0,0,0.1)]">
        {children}
      </div>
    </div>
  );
}