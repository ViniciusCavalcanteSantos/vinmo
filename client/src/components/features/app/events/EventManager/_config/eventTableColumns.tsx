import React from 'react';
import {TableColumnsType} from "antd";
import dayjs from "dayjs";
import {filesize} from "filesize";
import Event from "@/types/Event";
import ActionButtons from "@/components/features/app/events/EventManager/_components/ActionButtons";

interface GetColumnsProps {
  t: (key: string, options?: any) => string;
  defaultDateFormat: string;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

export const getEventTableColumns = (
  {
    t,
    defaultDateFormat,
    onEdit,
    onDelete
  }: GetColumnsProps): TableColumnsType<Event> => [
  {
    title: t('category'),
    dataIndex: ['type', 'category', "name"],
    sorter: (a, b) => a.type.category.name.localeCompare(b.type.category.name)
  },
  {
    title: t('contract'),
    sorter: (a, b) => a.contract?.code.localeCompare(b.contract?.code ?? '') ?? 0,
    render: (_, record) => `${record.contract?.code}`
  },
  {
    title: t('event'),
    dataIndex: ['type', "name"],
    sorter: (a, b) => a.type.name.localeCompare(b.type.name),
    render: (_, record) => `${record.type.name}: ${record.title}`
  },
  {
    title: t('event_date'),
    dataIndex: 'eventDate',
    render: (_, record) => (dayjs(record.eventDate).format(defaultDateFormat))
  },
  {
    title: t('start_time'),
    dataIndex: 'startTime'
  },
  {
    title: t('uploaded_photos'),
    dataIndex: ['temp'],
    render: (_, record) => record.totalImages
  },
  {
    title: t('separated_photos'),
    dataIndex: ['temp'],
    render: () => 0
  },
  {
    title: t('size'),
    dataIndex: ['temp'],
    render: (_, record) => filesize(record.totalSize)
  },
  {
    title: t('actions'),
    key: 'actions',
    align: 'center',
    fixed: 'right',
    width: 120,
    render: (_, record) => (
      <ActionButtons
        record={record}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    )
  }
];