'use client'

import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {fetchEvent, fetchEventImages} from "@/lib/database/Event";
import Event from "@/types/Event";
import {useNotification} from "@/contexts/NotificationContext";
import {useT} from "@/i18n/client";
import Fallback from "@/components/Fallback";
import ImageType from "@/types/Image";
import {ApiStatus} from "@/types/ApiResponse";
import {filesize} from "filesize";
import {Button, Dropdown, Empty, Image, Tooltip, Typography} from "antd";
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
import {downloadImage, fetchImageMetadata, removeImage} from "@/lib/database/Image";
import {formatImageMeta, FormattedMetaItem} from "@/lib/formatImageMeta";
import {MetadataModal} from "@/components/MetadataModal";
import Link from "next/link";

export default function Page() {
  const {t} = useT()
  const notification = useNotification();
  const router = useRouter();
  const params = useParams();
  const eventId = Number(params.event_id);
  const [event, setEvent] = useState<Event | null>(null);
  const [images, setImages] = useState<ImageType[]>([])
  const [imagesSize, setImagesSize] = useState(0)
  const [loading, setLoading] = useState<boolean>(true);
  const {defaultDateFormat} = useUser();

  const [metadata, setMetadata] = useState<FormattedMetaItem[]>([]);
  const [metadataOpen, setMetadataOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchEvent(eventId, true),
      fetchEventImages(eventId)
    ])
      .then(res => {
        const eventRes = res[0]
        const imageRes = res[1]

        if (eventRes.status === ApiStatus.SUCCESS && imageRes.status === ApiStatus.SUCCESS) {
          setEvent(eventRes.event)
          setImages(imageRes.images)
          setLoading(false)
          return;
        }

        notification.warning({message: t('unable_to_load_event')})
        router.push("/events");
      })
      .catch(() => {
        notification.warning({message: t('unable_to_load_event')})
        router.push("/events");
      })

  }, [eventId])

  useEffect(() => {
    const size = images.reduce((acc, image) => acc + (image.original?.size ?? 0), 0)
    setImagesSize(size)
  }, [images.length]);

  if (loading) return <Fallback/>

  const handleDownloadImage = (image: ImageType) => {
    downloadImage(image.id)
  }

  const handleDeleteImage = (image: ImageType) => {
    removeImage(image.id)
      .then(res => {
        if (res.status === ApiStatus.SUCCESS) {
          setImages(images.filter(i => i.id !== image.id))
        }
      })
  }

  const handleOpenMetadata = (image: ImageType) => {
    fetchImageMetadata(image.id)
      .then(res => {
        if (res.status === ApiStatus.SUCCESS) {
          const metadataArray = formatImageMeta(res.metadata, t)
          if (image.original?.height) metadataArray.unshift({
            label: t('height'),
            value: `${image.original?.height} pixels`
          })
          if (image.original?.width) metadataArray.unshift({
            label: t('width'),
            value: `${image.original?.width} pixels`
          })

          const mime = image.original?.mimeType ?? "";
          const subtype = mime.includes("/") ? mime.split("/")[1] : mime;
          if (image.original?.mimeType) metadataArray.unshift({
            label: t('image_type'),
            value: subtype.toUpperCase() || t("unknown").toUpperCase()
          })


          setMetadata(metadataArray)
          setMetadataOpen(true)
        }
      })
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
          // await handleOpenClients(img)
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
      <div className="flex flex-wrap gap-4 text-ant-text">
        <p><strong>{t('contract')}:</strong> {event?.contract?.code} - {event?.contract?.title}</p>
        <p><strong>{t('event')}:</strong> {event?.type.name}: {event?.title}</p>
        <p><strong>{t('total_photos')}:</strong> {images.length}</p>
        <p><strong>{t('size')}:</strong> {filesize(imagesSize ?? 0)}</p>
      </div>

      {/* grid de imagens */}
      {images.length > 0 ? (
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
              "
              >
                {/* wrapper da imagem */}
                <div className="w-full pt-[67%] relative">
                  <div className="absolute top-0 left-0 w-full h-full [&>.ant-image]:w-full [&>.ant-image]:h-full">
                    <Image src={image.url} className="rounded-t-lg object-contain !h-full"/>
                  </div>
                </div>

                {/* infos da imagem */}
                <div className="p-4 flex flex-wrap gap-2 text-ant-text">
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
                    <Button
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

      <MetadataModal open={metadataOpen} onClose={() => setMetadataOpen(false)} metadata={metadata}/>

    </div>
  )
}
