import {Modal} from "antd";
import {useT} from "@/i18n/client";

type MetaItem = { label: string; value: string };

type Props = {
  open: boolean;
  onClose: () => void;
  metadata: MetaItem[];
  loading: boolean
};

export function MetadataModal({open, onClose, metadata, loading}: Props) {
  const {t} = useT()

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
      loading={loading}
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
              className="bg-ant-fill-ter px-4 py-3"
            >
              <strong>{meta.label}</strong> | {meta.value}
            </p>
          );
        })}
      </div>
    </Modal>
  );
}
