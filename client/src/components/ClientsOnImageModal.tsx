import {Button, Dropdown, Image, Modal} from "antd";
import {useT} from "@/i18n/client";
import Client from "@/types/Client";
import {DeleteOutlined, EyeOutlined, InfoCircleOutlined, MoreOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {fetchClientCrop} from "@/lib/api/Image";
import ImageType from "@/types/Image";
import {ApiStatus} from "@/types/ApiResponse";

type Props = {
  open: boolean;
  onClose: () => void;
  clients: Client[];
  image: ImageType | null
};

type CropBox = {
  client: Client,
  x: number;
  y: number;
  w: number;
  h: number;
}

export function ClientsOnImageModal({open, onClose, clients, image}: Props) {
  const {t} = useT()

  const [activeCrop, setActiveCrop] = useState<CropBox | null>(null);
  const [activeCropOpen, setActiveCropOpen] = useState(false);


  useEffect(() => {
    if (!open) setActiveCrop(null);
  }, [open, image]);

  const seeClientCrop = (client: Client) => {
    if (!image) return;

    fetchClientCrop(image.id, client.id)
      .then(res => {
        if (res.status === ApiStatus.SUCCESS) {
          const faceCrop = res.faceMatch.faceCrop;
          setActiveCrop({
            client: client,
            x: faceCrop?.boxX ?? 0,
            y: faceCrop?.boxY ?? 0,
            w: faceCrop?.boxW ?? 0,
            h: faceCrop?.boxH ?? 0
          });
          setActiveCropOpen(true)
        }
      })
  }

  const menuFor = (client: Client) => ({
    onClick: async (info: { key: string }) => {
      switch (info.key) {
        case 'seeClient':
          seeClientCrop(client)
          break
      }
    },
    items: [
      {key: 'seeClient', icon: <EyeOutlined/>, label: t('Ver cliente na imagem')},
      {key: 'metadata', icon: <InfoCircleOutlined/>, label: t('view_metadata')},
      {type: 'divider' as const},
      {key: 'delete', icon: <DeleteOutlined/>, label: t('delete'), danger: true}
    ]
  })

  const viewBoxWidth = image?.original?.width ?? 1000;
  const viewBoxHeight = image?.original?.height ?? 1000;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onClose}
      title={"Clientes na imagem"}
      closable
      footer={null}
      className="!max-w-[95vw] md:!max-w-[50rem]"
    >
      <Modal
        title={activeCrop?.client?.name}
        open={activeCropOpen}
        onCancel={() => setActiveCropOpen(false)}
        onOk={() => setActiveCropOpen(false)}
        footer={null}
      >
        <div className="flex justify-center items-center min-h-[200px] bg-white rounded-md overflow-hidden">
          {image?.urls?.web ? (
            <div className="relative inline-block">
              <img
                src={image.urls.web}
                alt="Imagem Principal"
                className="block max-w-full max-h-[60vh] w-auto h-auto object-contain"
              />

              <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              >
                {activeCrop && (
                  <rect
                    x={activeCrop.x}
                    y={activeCrop.y}
                    width={activeCrop.w}
                    height={activeCrop.h}
                    fill="none"
                    stroke="#00ff00"
                    strokeWidth={Math.max(viewBoxWidth * 0.004, 2)}
                    style={{filter: 'drop-shadow(0px 0px 2px black)'}}
                  />
                )}
              </svg>
            </div>
          ) : (
            <div className="text-gray-400">Imagem não disponível</div>
          )}
        </div>
      </Modal>

      <div className="mt-4 space-y-4">
        <ul className="flex flex-col gap-2">
          {clients.map((client) => (
            <li
              className="bg-ant-fill-ter flex items-center gap-2 px-4 py-3 rounded-lg"
              key={client.id}>
              <Image
                className="rounded-avatar"
                src={client.profile.thumb}
                width={32}
                height={32}
                style={{cursor: 'pointer'}}
                preview={{src: client.profile.web, mask: <EyeOutlined/>}}
              />

              <h2 className="text-ant-text font-medium">{client.name}</h2>

              <Dropdown menu={menuFor(client)} trigger={['click']} className="ml-auto">
                <Button
                  type="text"
                  shape="circle"
                  aria-label={t('options')}
                  className="!text-2xl !text-ant-text-sec"
                >
                  <MoreOutlined/>
                </Button>
              </Dropdown>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}