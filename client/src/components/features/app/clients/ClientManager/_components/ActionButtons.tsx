import {Button, Space, Tooltip} from "antd";
import Link from "next/link";
import {DeleteOutlined, EditOutlined, LinkOutlined} from "@ant-design/icons";
import Client from "@/types/Client";
import {useT} from "@/i18n/client";

interface ActionButtonsProps {
  record: Client,
  onAssign: (client: Client) => void,
  onDelete: (client: Client) => void,
}

const ActionButtons = ({record, onAssign, onDelete}: ActionButtonsProps) => {
  const {t} = useT()

  return (
    <Space size="middle">
      <Tooltip title={t('edit')} destroyOnHidden>
        <Link href={`/app/clients/manage/${record.id}`}>
          <Button
            type="text"
            shape="circle"
            icon={<EditOutlined/>}
          />
        </Link>
      </Tooltip>
      <Tooltip title={t('assign')} destroyOnHidden>
        <Button
          type="text"
          shape="circle"
          icon={<LinkOutlined/>}
          onClick={() => onAssign(record)}
        />
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

export default ActionButtons