import {Button, Space, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {useT} from "@/i18n/client";
import Contract from "@/types/Contract";

interface ActionButtonsProps {
  record: Contract,
  onEdit: (contract: Contract) => void,
  onDelete: (contract: Contract) => void
}

const ActionButtons = ({record, onEdit, onDelete}: ActionButtonsProps) => {
  const {t} = useT()
  return (
    <Space size="middle">
      <Tooltip title={t('edit')} destroyOnHidden>
        <Button
          type="text"
          shape="circle"
          icon={<EditOutlined/>}
          onClick={() => onEdit(record)}
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