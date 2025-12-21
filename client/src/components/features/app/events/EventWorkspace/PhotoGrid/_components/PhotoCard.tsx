import {useT} from "@/i18n/client";
import {filesize} from "filesize";
import dayjs from "dayjs";
import {Badge, Button, Dropdown, Image, Tooltip} from "antd";
import {DeleteOutlined, DownloadOutlined, InfoCircleOutlined, MoreOutlined, TeamOutlined} from "@ant-design/icons";
import {default as ImageType} from "@/types/Image";
import {useUser} from "@/contexts/UserContext";
import React from "react";

interface PhotoCardProps {
  image: ImageType
  onDownload: (image: ImageType) => void
  onMetadata: (image: ImageType) => void
  onClients: (image: ImageType) => void
  onDelete: (image: ImageType) => void
}

export default function PhotoCard({image, onDownload, onMetadata, onClients, onDelete}: PhotoCardProps) {
  const {t} = useT()
  const {defaultDateFormat} = useUser();

  const menuFor = (img: ImageType) => ({
    onClick: async (info: { key: string }) => {
      switch (info.key) {
        case 'download':
          onDownload(img)
          break
        case 'metadata':
          onMetadata(img)
          break
        case 'clients':
          onClients(img)
          break
        case 'delete':
          onDelete(img)
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
    <div>
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
  )
}