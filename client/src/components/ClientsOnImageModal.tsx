import {Button, Dropdown, Image, Modal} from "antd";
import {useT} from "@/i18n/client";
import Client from "@/types/Client";
import {DeleteOutlined, EyeOutlined, InfoCircleOutlined, MoreOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import ImageType from "@/types/Image";
import {useClientCrop} from "@/lib/queries/images/useClientCrop";
import Fallback from "@/components/Fallback";

type Props = {
  open: boolean;
  onClose: () => void;
  clients: Client[];
  image: ImageType | null
};

export function ClientsOnImageModal({open, onClose, clients, image}: Props) {
  const {t} = useT()

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);

  const cropQuery = useClientCrop(image?.id, selectedClient?.id, cropModalOpen);

  const handleOpenCrop = (client: Client) => {
    setSelectedClient(client);
    setCropModalOpen(true);
  };

  const handleCloseCrop = () => {
    setCropModalOpen(false);
  };

  const menuFor = (client: Client) => ({
    onClick: async (info: { key: string }) => {
      switch (info.key) {
        case 'seeClient':
          handleOpenCrop(client);
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

  const cropData = cropQuery.data;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onClose}
      title={t('clients_on_image')}
      closable
      footer={null}
      className="!max-w-[95vw] md:!max-w-[50rem]"
    >
      <Modal
        title={selectedClient?.name}
        open={cropModalOpen}
        onCancel={handleCloseCrop}
        onOk={handleCloseCrop}
        footer={null}
        width={800}
      >
        <div
          className="flex justify-center items-center min-h-[200px] bg-ant-bg-layout rounded-md overflow-hidden relative">
          {cropQuery.isLoading && (
            <Fallback/>
          )}

          {image?.urls?.web ? (
            <div className="relative inline-block">
              <img
                src={image.urls.web}
                alt="Imagem Principal"
                className="block max-w-full max-h-[60vh] w-auto h-auto object-contain select-none"
              />

              <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              >
                {cropQuery.isSuccess && cropData && (
                  <rect
                    x={cropData.boxX}
                    y={cropData.boxY}
                    width={cropData.boxW}
                    height={cropData.boxH}
                    fill="none"
                    stroke="#00ff00"
                    strokeWidth={Math.max(viewBoxWidth * 0.004, 2)}
                    style={{filter: 'drop-shadow(0px 0px 2px black)'}}
                  />
                )}
              </svg>
            </div>
          ) : (
            <div className="text-gray-400 p-10">{t('unable_to_get_image')}</div>
          )}
        </div>
      </Modal>

      {/* Lista de Clientes */}
      <div className="mt-4 space-y-4">
        <ul className="flex flex-col gap-2">
          {clients.map((client) => (
            <li
              className="bg-ant-fill-ter flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-ant-fill-secondary transition-colors"
              key={client.id}>
              <Image
                className="rounded-avatar object-cover"
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
                  className="!text-2xl !text-ant-text-sec hover:!text-ant-primary"
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