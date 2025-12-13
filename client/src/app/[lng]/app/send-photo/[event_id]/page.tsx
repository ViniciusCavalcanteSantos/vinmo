import React from 'react';
import UploadZone from "@/components/Screens/App/Events/EventWorkspace/UploadZone";
import {Metadata, ResolvingMetadata} from "next";
import createPageMetadata from "@/lib/createPageMetadata";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return createPageMetadata(
    {
      path: "app",
      titleKey: "seo.send_photo.title",
      descriptionKey: "seo.send_photo.description",
      isAppRoute: true,
      robots: {index: false, follow: false}
    },
    parent
  );
}

const Page: React.FC = () => {
  return <UploadZone/>
};

export default Page;