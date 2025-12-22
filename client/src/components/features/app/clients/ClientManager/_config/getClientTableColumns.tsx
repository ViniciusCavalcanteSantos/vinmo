import {Image, TableColumnsType} from "antd";
import Client from "@/types/Client";
import {EyeOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import ActionButtons from "@/components/features/app/clients/ClientManager/_components/ActionButtons";

interface GetColumnsProps {
  t: (key: string, options?: any) => string;
  onAssign: (client: Client) => void;
  onDelete: (client: Client) => void;
  defaultDateFormat?: string,
}

export const getClientTableColumns = (
  {
    t,
    onAssign,
    onDelete,
    defaultDateFormat
  }: GetColumnsProps): TableColumnsType<Client> => [
  {
    title: t('name'),
    dataIndex: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (_, record) => (
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
        <Image
          className="rounded-avatar"
          src={record.profile.thumb}
          width={32}
          height={32}
          style={{cursor: 'pointer'}}
          preview={{src: record.profile.web, cover: <EyeOutlined/>}}
        />
        <span>{record.name}</span>
      </div>
    ),
  },
  {
    title: t('code'),
    dataIndex: 'code',
    sorter: (a, b) => a.code?.localeCompare(b.code ?? "") ?? 1
  },
  {
    title: t('birthdate'),
    dataIndex: 'birthdate',
    sorter: (a, b) => {
      const dateA = a.birthdate ? dayjs(a.birthdate).valueOf() : 0;
      const dateB = b.birthdate ? dayjs(b.birthdate).valueOf() : 0;
      return dateA - dateB;
    },
    render: (_, record) => (record.birthdate ? dayjs(record.birthdate).format(defaultDateFormat) : '')
  },
  {
    title: t('phone'),
    dataIndex: 'phone',
    sorter: (a, b) => a.phone?.localeCompare(b.phone ?? "") ?? 1
  },
  {
    title: t('actions'),
    key: 'actions',
    align: 'center',
    fixed: 'right',
    width: 120,
    render: (_, record) => <ActionButtons record={record} onAssign={onAssign} onDelete={onDelete}/>
  }
]