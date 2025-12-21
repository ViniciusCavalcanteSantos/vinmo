'use client'

import {useParams, useRouter} from "next/navigation";
import React, {useEffect, useMemo, useState} from "react";
import {useNotification} from "@/contexts/NotificationContext";
import {useT} from "@/i18n/client";
import Fallback from "@/components/ui/Fallback";
import ImageType from "@/types/Image";
import {filesize} from "filesize";
import {Button, Empty, Typography} from "antd";
import {InboxOutlined} from "@ant-design/icons";
import {MetadataModal} from "@/components/features/app/events/EventWorkspace/PhotoGrid/_modals/MetadataModal";
import Link from "next/link";
import {
  ClientsOnImageModal
} from "@/components/features/app/events/EventWorkspace/PhotoGrid/_modals/ClientsOnImageModal";
import {useEvent} from "@/lib/queries/events/useEvent";
import {useEventImages} from "@/lib/queries/events/useEventImages";
import {downloadImage} from "@/lib/api/images/downloadImage";
import {useRemoveImage} from "@/lib/queries/images/useRemoveImage";
import {useImageMetadata} from "@/lib/queries/images/useImageMetadata";
import {useImageClients} from "@/lib/queries/images/useImageClients";
import PhotoCard from "@/components/features/app/events/EventWorkspace/PhotoGrid/_components/PhotoCard";
import useFormattedMetadata
  from "@/components/features/app/events/EventWorkspace/PhotoGrid/_hooks/useFormattedMetadata";

export default function PhotoGrid() {
  const {t} = useT()
  const notification = useNotification();
  const router = useRouter();
  const params = useParams();
  const eventId = Number(params.event_id);

  const [imageSelected, seImageSelected] = useState<ImageType | null>(null)

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
  } = useEventImages(eventId);

  const removeImage = useRemoveImage(eventId);

  const loading = loadingEvent || loadingImages;
  const isError = eventError || imagesError;

  useEffect(() => {
    if (isError) {
      notification.warning({title: t("unable_to_load_event")});
      router.push("/app/events");
    }
  }, [isError, notification, t, router]);

  const {metadata, isError: isMetadataError, error: metadataError} = useFormattedMetadata(
    metadataQuery.data,
    imageSelected,
    metadataOpen
  );

  useEffect(() => {
    if (isMetadataError) {
      notification.warning({title: metadataError?.message || t('unable_to_load_metadata')});
    }
  }, [isMetadataError, metadataError]);

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
          notification.success({title: res.message});
        }
      });
    } catch (err: any) {
      notification.warning({title: err?.message || t('unable_to_delete')});
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
            <PhotoCard key={image.id} image={image} onDownload={handleDownloadImage} onMetadata={handleOpenMetadata}
                       onClients={handleOpenClients} onDelete={handleDeleteImage}/>
          ))}
        </div>
      ) : (
        <div className="mt-16">
          <Empty
            image={<InboxOutlined className="!text-8xl !text-ant-primary"/>}
            description={<Typography.Text>{t('no_photos_in_event_yet')}</Typography.Text>}
          >
            <Link href={`/app/send-photo/${event?.id}`}>
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