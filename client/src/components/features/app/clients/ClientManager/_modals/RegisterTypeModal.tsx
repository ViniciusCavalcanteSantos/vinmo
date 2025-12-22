import React from 'react';
import {Form, Modal, Select} from 'antd';
import {useRouter} from 'next/navigation';
import {useT} from "@/i18n/client";

interface RegisterTypeModalProps {
  open: boolean;
  onCancel: () => void;
  onGenerateLink: () => void;
}

export default function RegisterTypeModal({open, onCancel, onGenerateLink}: RegisterTypeModalProps) {
  const {t} = useT();
  const router = useRouter();
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then(({register_type}) => {
      if (register_type === 'manual') {
        router.push('/app/clients/manage/new');
      } else if (register_type === 'image_name') {
        router.push('/app/clients/create/by-image-name');
      } else {
        onCancel();
        onGenerateLink();
      }
    });
  };

  return (
    <Modal
      open={open}
      title={t('choose_register_type')}
      okText={t('go')}
      onCancel={onCancel}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="register_type"
          label={t('register_type')}
          rules={[{required: true, message: t('select_a_register_type')}]}
        >
          <Select
            placeholder={t('select_a_register_type')}
            options={[
              {value: "manual", label: t("manual_registration")},
              {value: "image_name", label: t("by_image_name")},
              {value: "link", label: t("by_link")}
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}