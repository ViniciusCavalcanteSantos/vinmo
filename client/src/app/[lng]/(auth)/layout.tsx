"use client"

import {PropsWithChildren, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Fallback from "@/components/Fallback";

export default function Layout({children}: PropsWithChildren) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token")
    if(token) router.replace("/home")
    else {
      setChecking(false);
    }
  }, [])

  if(checking) return <Fallback />;

  return (
    <div className="h-full flex justify-center items-center">
      <div className="w-100 bg-white px-10 py-8 rounded-sm shadow-[0_0_10px_rgba(0,0,0,0.1)]">
        {children}
      </div>
    </div>
  );
}