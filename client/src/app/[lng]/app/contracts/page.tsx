import React from "react";
import ContractManager from "@/components/features/app/contracts/ContractManager";
import {Metadata, ResolvingMetadata} from "next";
import createPageMetadata from "@/lib/createPageMetadata";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return createPageMetadata(
    {
      path: "app",
      titleKey: "seo.contracts.index.title",
      descriptionKey: "seo.contracts.index.description",
      isAppRoute: true,
      robots: {index: false, follow: false}
    },
    parent
  );
}

export default function Page() {
  return <ContractManager/>;
}
