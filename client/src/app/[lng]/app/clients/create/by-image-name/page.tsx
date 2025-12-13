import React from 'react';
import CreateFromImageName from "@/components/Screens/App/Clients/Onboarding/CreateFromImageName";
import {Metadata, ResolvingMetadata} from "next";
import createPageMetadata from "@/lib/createPageMetadata";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return createPageMetadata(
    {
      path: "app",
      titleKey: "seo.clients.create_by_image.title",
      descriptionKey: "seo.clients.create_by_image.description",
      isAppRoute: true,
      robots: {index: false, follow: false}
    },
    parent
  );
}

export default function Page() {

  return <CreateFromImageName/>
};
