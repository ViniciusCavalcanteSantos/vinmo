import type {Metadata, ResolvingMetadata} from "next";
import {getT} from "@/i18n";

type Options = {
  path: string;
  titleKey: string;
  descriptionKey: string;
};

async function createPageMetadata(
  {path, titleKey, descriptionKey}: Options,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const parentMetadata = await parent;
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "App";
  const baseUrl = String(parentMetadata.alternates?.canonical?.url || "https://photon.org");

  const {t} = await getT();
  const title = t(titleKey);
  const description = t(descriptionKey);

  return {
    title: `${title} | ${appName}`,
    description,
    alternates: {
      canonical: `${baseUrl}/${path}`,
      languages: {
        en: `${baseUrl?.replace(/\/pt-BR$/, "/en")}/${path}`,
        "pt-BR": `${baseUrl?.replace(/\/en$/, "/pt-BR")}/${path}`,
        "x-default": `${baseUrl?.replace(/\/pt-BR$/, "/en")}/${path}`,
      },
    },
  };
}

export default createPageMetadata;
