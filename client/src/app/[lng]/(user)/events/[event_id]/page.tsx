'use client'

import {useParams, useRouter} from "next/navigation";
import React, {useEffect, useMemo, useState} from "react";
import {useNotification} from "@/contexts/NotificationContext";
import {useT} from "@/i18n/client";
import Fallback from "@/components/Fallback";
import ImageType from "@/types/Image";
import {filesize} from "filesize";
import {Badge, Button, Dropdown, Empty, Image, Tooltip, Typography} from "antd";
import dayjs from "dayjs";
import {useUser} from "@/contexts/UserContext";
import {
  DeleteOutlined,
  DownloadOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  TeamOutlined
} from "@ant-design/icons";
import {formatImageMeta, FormattedMetaItem} from "@/lib/formatImageMeta";
import {MetadataModal} from "@/components/MetadataModal";
import Link from "next/link";
import {ClientsOnImageModal} from "@/components/ClientsOnImageModal";
import {useEvent} from "@/lib/queries/events/useEvent";
import {useFetchEventImages} from "@/lib/queries/events/useEventImages";
import {downloadImage} from "@/lib/api/images/downloadImage";
import {useRemoveImage} from "@/lib/queries/images/useRemoveImage";
import {useImageMetadata} from "@/lib/queries/images/useImageMetadata";
import {useImageClients} from "@/lib/queries/images/useImageClients";

export default function Page() {
  const {t} = useT()
  const notification = useNotification();
  const router = useRouter();
  const params = useParams();
  const eventId = Number(params.event_id);
  const {defaultDateFormat} = useUser();

  const [imageSelected, seImageSelected] = useState<ImageType | null>(null)

  const [metadata, setMetadata] = useState<FormattedMetaItem[]>([]);
  const [metadataOpen, setMetadataOpen] = useState(false);
  const metadataQuery = useImageMetadata(imageSelected?.id, metadataOpen);

  const [clientsOpen, setClientsOpen] = useState(false);
  const {data: clients} = useImageClients(imageSelected?.id, clientsOpen);


  const {
    data: event,
    isLoading: loadingEvent,
    isError: eventError,
  } = useEvent(eventId, true);

  const {
    data: images,
    isLoading: loadingImages,
    isError: imagesError,
  } = useFetchEventImages(eventId);

  const removeImage = useRemoveImage(eventId);

  const loading = loadingEvent || loadingImages;
  const isError = eventError || imagesError;

  useEffect(() => {
    if (isError) {
      notification.warning({message: t("unable_to_load_event")});
      router.push("/events");
    }
  }, [isError, notification, t, router]);

  useEffect(() => {
    if (metadataQuery.data && imageSelected && metadataOpen) {
      try {
        const metadataArray = formatImageMeta(metadataQuery.data, t);
        if (imageSelected.original?.height) {
          metadataArray.unshift({
            label: t('height'),
            value: `${imageSelected.original?.height} pixels`
          });
        }
        if (imageSelected.original?.width) {
          metadataArray.unshift({
            label: t('width'),
            value: `${imageSelected.original?.width} pixels`
          });
        }

        const mime = imageSelected.original?.mimeType ?? "";
        const subtype = mime.includes("/") ? mime.split("/")[1] : mime;
        if (imageSelected.original?.mimeType) {
          metadataArray.unshift({
            label: t('image_type'),
            value: subtype.toUpperCase() || t("unknown").toUpperCase()
          });
        }

        setMetadata(metadataArray);
      } catch (err: any) {
        notification.warning({message: t('unable_to_load_metadata')});
      }
    }
  }, [metadataQuery.data, imageSelected, metadataOpen, t, notification]);

  useEffect(() => {
    if (metadataQuery.isError && metadataOpen) {
      notification.warning({message: (metadataQuery.error as any)?.message ?? t('unable_to_load_metadata')});
    }
  }, [metadataQuery.isError, metadataQuery.error, metadataOpen, notification, t]);

  const imagesSize = useMemo(() => {
    return images?.reduce((acc, image) => acc + (image.original?.size ?? 0), 0) ?? 0
  }, [images])

  if (loading || isError) return <Fallback/>

  const handleDownloadImage = (image: ImageType) => {
    downloadImage(image.id)
  }

  const handleDeleteImage = (image: ImageType) => {
    try {
      removeImage.mutate(image.id, {
        onSuccess: (res) => {
          notification.success({message: res.message});
        }
      });
    } catch (err: any) {
      notification.warning({message: err?.message || t('unable_to_delete')});
    }
  }

  const handleOpenMetadata = (image: ImageType) => {
    seImageSelected(image);
    setMetadataOpen(true);
  }

  const handleOpenClients = (image: ImageType) => {
    seImageSelected(image);
    setClientsOpen(true);
  }

  const menuFor = (img: ImageType) => ({
    onClick: async (info: { key: string }) => {
      switch (info.key) {
        case 'download':
          handleDownloadImage(img)
          break
        case 'metadata':
          handleOpenMetadata(img)
          break
        case 'clients':
          handleOpenClients(img)
          break
        case 'delete':
          handleDeleteImage(img)
          break
      }
    },
    items: [
      {key: 'download', icon: <DownloadOutlined/>, label: t('download')},
      {key: 'metadata', icon: <InfoCircleOutlined/>, label: t('view_metadata')},
      {type: 'divider' as const},
      {key: 'delete', icon: <DeleteOutlined/>, label: t('delete'), danger: true}
    ]
  })

  return (
    <div className="space-y-4">
      {/* header das infos do evento */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-ant-text">
        <p><strong>{t('contract')}:</strong> {event?.contract?.code} - {event?.contract?.title}</p>
        <p><strong>{t('event')}:</strong> {event?.type.name}: {event?.title}</p>
        <p><strong>{t('total_photos')}:</strong> {images?.length ?? 0}</p>
        <p><strong>{t('size')}:</strong> {filesize(imagesSize ?? 0)}</p>
      </div>

      {/* grid de imagens */}
      {images?.length ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
          {images.map(image => (
            <div key={image.id}>
              <div
                className="
                max-w-sm mx-auto
                bg-ant-bg-elevated
                border border-ant-border-sec
                rounded-lg
                shadow-ant-1
                flex flex-col
                h-full
              "
              >
                {/* wrapper da imagem */}
                <div className="w-full pt-[67%] relative">
                  <div className="absolute top-0 left-0 w-full h-full [&>.ant-image]:w-full [&>.ant-image]:h-full">
                    <Image src={image.urls?.web} className="rounded-t-lg object-contain !h-full"/>
                  </div>
                </div>

                {/* infos da imagem */}
                <div className="p-4 flex flex-wrap gap-2 text-ant-text flex-grow">
                  <p className="w-full">
                    <strong>{t('name')}:</strong> {image.original?.name}
                  </p>
                  <p>
                    <strong>{t('size')}:</strong> {filesize(image.original?.size ?? 0)}
                  </p>
                  <p>
                    <strong>{t('upload_date')}:</strong> {dayjs(image.createdAt).format(defaultDateFormat)}
                  </p>
                </div>

                {/* linha separadora */}
                <div className="w-full h-px bg-ant-border-sec"></div>

                {/* ações */}
                <div className="flex justify-end gap-4 p-4">
                  <Tooltip title={t('clients_in_image')}>
                    <Badge
                      count={image.clientsOnImageCount}
                      size="small" style={{fontSize: 10, background: "var(--ant-color-primary)"}}
                      offset={[-4, 4]}
                    >
                      <Button
                        onClick={() => menuFor(image).onClick({key: 'clients'})}
                        type="text"
                        shape="circle"
                        aria-label={t('options')}
                        className="
                          !text-2xl
                          !text-ant-text-sec
                        "
                      >
                        <TeamOutlined/>
                      </Button>
                    </Badge>
                  </Tooltip>

                  <Dropdown menu={menuFor(image)} trigger={['click']}>
                    <Button
                      type="text"
                      shape="circle"
                      aria-label={t('options')}
                      className="
                      !text-2xl
                      !text-ant-text-sec
                    "
                    >
                      <MoreOutlined/>
                    </Button>
                  </Dropdown>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-16">
          <Empty
            image={<InboxOutlined className="!text-8xl !text-ant-primary"/>}
            description={<Typography.Text>{t('no_photos_in_event_yet')}</Typography.Text>}
          >
            <Link href={`/send-photo/${event?.id}`}>
              <Button type='primary'>{t('add_photos')}</Button>
            </Link>
          </Empty>
        </div>
      )}

      <MetadataModal
        open={metadataOpen}
        onClose={() => setMetadataOpen(false)}
        metadata={metadata}
        loading={metadataQuery.isFetching}
      />

      <ClientsOnImageModal open={clientsOpen} onClose={() => setClientsOpen(false)} clients={clients ?? []}
                           image={imageSelected}/>
    </div>
  )
}