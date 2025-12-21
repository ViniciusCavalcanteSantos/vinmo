import {useMemo} from "react";
import {default as ImageType, ImageMeta} from "@/types/Image";
import {formatImageMeta, FormattedMetaItem} from "@/lib/formatImageMeta";
import {useT} from "@/i18n/client";

export default function useFormattedMetadata(metadataRaw?: ImageMeta, image?: ImageType | null, enabled = true) {
  const {t} = useT()

  return useMemo(() => {
    if (!enabled || !metadataRaw) {
      return {metadata: [], isError: false, error: undefined};
    }

    try {
      const metadataArray = formatImageMeta(metadataRaw, t);
      const extraItems: FormattedMetaItem[] = [];
      if (image?.original?.mimeType) {
        const mime = image.original.mimeType;
        const subtype = mime.includes("/") ? mime.split("/")[1] : mime;
        extraItems.push({
          label: t('image_type'),
          value: subtype.toUpperCase() || t("unknown").toUpperCase()
        });
      }

      if (image?.original?.width) {
        extraItems.push({
          label: t('width'),
          value: `${image.original.width} pixels`
        });
      }

      if (image?.original?.height) {
        extraItems.push({
          label: t('height'),
          value: `${image.original.height} pixels`
        });
      }

      return {
        metadata: [...extraItems, ...metadataArray],
        isError: false,
        error: undefined
      };
    } catch (err: any) {
      return {metadata: [], isError: true, error: err};
    }
  }, [metadataRaw, image, t, enabled])
}