import {EchoProvider} from "@/contexts/EchoContext";
import React from "react";

export default function Providers({children}: { children: React.ReactNode }) {
  return (
    <EchoProvider>
      {children}
    </EchoProvider>
  )
}