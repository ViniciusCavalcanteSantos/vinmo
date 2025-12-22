import type {Metadata, ResolvingMetadata} from "next";
import {getT} from "@/i18n";

type Options = {
  path: string;
  titleKey: string;
  descriptionKey: string;
  robots?: Metadata["robots"];
  image?: string;
  isAppRoute?: boolean;
};

async function createPageMetadata(
  {path, titleKey, descriptionKey, robots, image, isAppRoute = false}: Options,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const parentMetadata = await parent;
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Photon";

  let baseUrlString = String(parentMetadata.alternates?.canonical?.url || "https://photon.org");
  baseUrlString = baseUrlString.replace(/\/$/, "").replace(/\/(pt-BR|en)$/, "");

  const {t} = await getT('seo');
  const title = t(titleKey);
  const description = t(descriptionKey);
  const defaultImage = "/og-default.png";

  const alternates = isAppRoute
    ? {
      canonical: `${baseUrlString}/${path}`,
    }
    : {
      canonical: `${baseUrlString}/${path}`,
      languages: {
        en: `${baseUrlString}/en/${path}`,
        "pt-BR": `${baseUrlString}/pt-BR/${path}`,
        "x-default": `${baseUrlString}/en/${path}`,
      },
    };

  return {
    title: `${title} | ${appName}`,
    description,
    robots: robots,
    openGraph: {
      title: `${title} | ${appName}`,
      description,
      url: `${baseUrlString}/${path}`,
      siteName: appName,
      images: [{url: image || defaultImage, width: 1200, height: 630}],
      type: "website",
      locale: "pt_BR",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${appName}`,
      description,
      images: [image || defaultImage],
    },
    alternates: alternates,
  };
}

export default createPageMetadata;