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
import {Button, Dropdown, Image, Modal, Tooltip} from "antd";
import dayjs from "dayjs";
import {useUser} from "@/contexts/UserContext";
import {DeleteOutlined, DownloadOutlined, InfoCircleOutlined, MoreOutlined, TeamOutlined} from "@ant-design/icons";
import downloadFile from "@/lib/download";
import {fetchImageMetadata} from "@/lib/database/Image";
import {formatImageMeta, FormattedMetaItem} from "@/lib/formatImageMeta";

export default function Page() {
  const {t} = useT()
  const notification = useNotification();
  const router = useRouter();
  const params = useParams();
  const eventId = Number(params.event_id);
  const [event, setEvent] = useState<Event | null>(null);
  const [images, setImages] = useState<ImageType[]>([])
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

  if (loading) return <Fallback/>

  const handleDownloadImage = (image: ImageType) => {
    downloadFile(`${process.env.NEXT_PUBLIC_API_URL}/api/images/${image.id}/download`)
  }

  const handleOpenMetadata = (image: ImageType) => {
    fetchImageMetadata(image.id)
      .then(res => {
        if (res.status === ApiStatus.SUCCESS) {
          setMetadata(formatImageMeta(res.metadata, t))
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
          // await handleDeleteImage(img)
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
        <p><strong>{t('total_photos')}:</strong> {event?.totalImages ?? 0}</p>
        <p><strong>{t('size')}:</strong> {filesize(event?.totalSize ?? 0)}</p>
      </div>

      {/* grid de imagens */}
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
                  <strong>{t('name')}:</strong> {image.originalName}
                </p>
                <p>
                  <strong>{t('size')}:</strong> {filesize(image.originalSize ?? 0)}
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

      <Modal
        open={metadataOpen}
        okText={false as unknown as string}
        cancelText={t('cancel')}
        width={800}
        onCancel={() => setMetadataOpen(false)}
        destroyOnHidden
        modalRender={(node) => {
          return (
            <div
              className="
                bg-ant-bg
                text-ant-text
                max-w-[40rem]
                mx-auto p-6
                rounded-2xl
                shadow-ant-2
                border border-ant-border-sec
              "
            >
              <h2 className="text-[16px] font-medium text-center mb-4">
                {t('metadata')}
              </h2>

              <div className="flex flex-col gap-2 w-full">
                {metadata.map(meta => {
                  return (
                    <h2><strong>{meta.label}</strong> | {meta.value}</h2>
                  );
                })}
              </div>
            </div>
          )
        }}
      >
      </Modal>
    </div>
  )
}
