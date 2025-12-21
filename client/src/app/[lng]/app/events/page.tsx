import React from "react";
import EventManager from "@/components/features/app/events/EventManager/EventManager";
import {Metadata, ResolvingMetadata} from "next";
import createPageMetadata from "@/lib/createPageMetadata";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return createPageMetadata(
    {
      path: "app",
      titleKey: "seo.events.index.title",
      descriptionKey: "seo.events.index.description",
      isAppRoute: true,
      robots: {index: false, follow: false}
    },
    parent
  );
}

export default function Page() {


  return <EventManager/>
}
