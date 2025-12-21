'use client'

import {Button, Space, Tooltip} from "antd";
import Link from "next/link";
import {DeleteOutlined, EditOutlined, EyeOutlined, UploadOutlined} from "@ant-design/icons";
import {useT} from "@/i18n/client";
import Event from "@/types/Event";

interface ActionButtonsProps {
  record: Event,
  onEdit: (event: Event) => void,
  onDelete: (event: Event) => void
}

export default function ActionButtons({record, onEdit, onDelete}: ActionButtonsProps) {
  const {t} = useT()

  return (
    <Space size="middle">
      <Tooltip title={t('view')} destroyOnHidden>
        <Link href={`/app/events/${record.id}`}>
          <Button
            type="text"
            shape="circle"
            icon={<EyeOutlined/>}
            onClick={() => (record)}
          />
        </Link>

      </Tooltip>
      <Tooltip title={t('edit')} destroyOnHidden>
        <Button
          type="text"
          shape="circle"
          icon={<EditOutlined/>}
          onClick={() => onEdit(record)}
        />
      </Tooltip>
      <Tooltip title={t('send_photo')} destroyOnHidden>
        <Link href={`/app/send-photo/${record.id}`}>
          <Button
            type="text"
            shape="circle"
            icon={<UploadOutlined/>}
          />
        </Link>
      </Tooltip>
      <Tooltip title={t('delete')} destroyOnHidden>
        <Button
          type="text"
          shape="circle"
          danger
          icon={<DeleteOutlined/>}
          onClick={() => onDelete(record)}
        />
      </Tooltip>
    </Space>
  )
}