import React from "react";
import ClientManager from "@/components/Screens/App/Clients/ClientManager";
import {Metadata, ResolvingMetadata} from "next";
import createPageMetadata from "@/lib/createPageMetadata";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return createPageMetadata(
    {
      path: "app",
      titleKey: "seo.clients.index.title",
      descriptionKey: "seo.clients.index.description",
      isAppRoute: true,
      robots: {index: false, follow: false}
    },
    parent
  );
}

export default function Page() {
  return <ClientManager/>
}

