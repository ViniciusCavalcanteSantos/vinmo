import React from "react";
import PhotoGrid from "@/components/Screens/App/Events/EventWorkspace/PhotoGrid";
import {Metadata, ResolvingMetadata} from "next";
import createPageMetadata from "@/lib/createPageMetadata";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return createPageMetadata(
    {
      path: "app",
      titleKey: "seo.events.workspace.title",
      descriptionKey: "seo.events.workspace.description",
      isAppRoute: true,
      robots: {index: false, follow: false}
    },
    parent
  );
}


export default function Page() {
  return <PhotoGrid/>
}