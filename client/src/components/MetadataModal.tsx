import {Modal, theme} from "antd";
import {useT} from "@/i18n/client";

type MetaItem = { label: string; value: string };

type Props = {
  open: boolean;
  onClose: () => void;
  metadata: MetaItem[];
};

export function MetadataModal({open, onClose, metadata}: Props) {
  const {t} = useT()
  const {token} = theme.useToken();

  metadata.unshift()

  return (
    <Modal
      open={open}
      width={800}
      onCancel={onClose}
      onOk={onClose}
      destroyOnHidden
      closable
      cancelButtonProps={{className: '!hidden'}}
      className="
        !max-w-[40rem]
      "
    >
      <h2 className="text-[16px] font-semibold text-center mb-4">
        {t('metadata')}
      </h2>

      <div
        className="
          shadow-border
          flex flex-col gap-[2px] w-full
          [&>p:nth-child(1)]:rounded-t-lg
          [&>p:last-child]:rounded-b-lg
        "
      >
        {metadata.map(meta => {
          return (
            <p
              key={meta.value}
              className="bg-ant-bg-spotlight px-4 py-3"
            >
              <strong>{meta.label}</strong> | {meta.value}
            </p>
          );
        })}
      </div>
    </Modal>
  );
}
