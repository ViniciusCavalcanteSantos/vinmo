"use client"

import {PropsWithChildren, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Fallback from "@/components/Fallback";

export default function Layout({children}: PropsWithChildren) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) router.replace("/home")
    else {
      setChecking(false);
    }
  }, [])

  if (checking) return <Fallback/>;

  return (
    <div className="h-full flex justify-center items-center bg-background">
      {children}
    </div>
  );
}