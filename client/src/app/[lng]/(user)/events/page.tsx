"use client"

import {Button, Card, Empty, Flex, Space, Table, TableColumnsType, TablePaginationConfig, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {SorterResult} from "antd/es/table/interface";
import Search from "antd/es/input/Search";
import {useT} from "@/i18n/client";
import EventType from "@/types/EventType";
import {DeleteOutlined, EditOutlined, EyeOutlined, UploadOutlined} from "@ant-design/icons";
import {useDebounce} from "react-use";
import {useEvents} from "@/contexts/EventsContext";
import {ApiStatus} from "@/types/ApiResponse";
import ManageEventModal from "@/components/ManageEventModal";
import PageHeader from "@/components/PageHeader";
import dayjs from "dayjs";
import {useUser} from "@/contexts/UserContext";

export default function Page() {
  const {t} = useT();
  const [open, setOpen] = useState(false);
  const {events, fetchEvents, loadingEvents, removeEvent} = useEvents();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermDebounce, setSearchTermDebounce] = useState("");
  useDebounce(() => {
    setSearchTermDebounce(searchTerm);
  }, 300, [searchTerm])

  const {defaultDateFormat} = useUser();

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  const [editingEvent, setEditingEvent] = useState<EventType>();
  const editEvent = (event: EventType) => {
    setEditingEvent(event)
    setOpen(true)
  }

  const ActionButtons = ({record}: { record: EventType }) => (
    <Space size="middle">
      <Tooltip title={t('view')} destroyOnHidden>
        <Button
          type="text"
          shape="circle"
          icon={<EyeOutlined/>}
          onClick={() => (record)}
        />
      </Tooltip>
      <Tooltip title={t('edit')} destroyOnHidden>
        <Button
          type="text"
          shape="circle"
          icon={<EditOutlined/>}
          onClick={() => editEvent(record)}
        />
      </Tooltip>
      <Tooltip title={t('send_photo')} destroyOnHidden>
        <Button
          type="text"
          shape="circle"
          icon={<UploadOutlined/>}
          onClick={() => (record)}
        />
      </Tooltip>
      <Tooltip title={t('delete')} destroyOnHidden>
        <Button
          type="text"
          shape="circle"
          danger
          icon={<DeleteOutlined/>}
          onClick={() => removeEvent(record.id)}
        />
      </Tooltip>
    </Space>
  )


  const columns: TableColumnsType<EventType> = [
    {
      title: t('event_name'),
      dataIndex: ['type', "name"],
      sorter: (a, b) => a.type.name.localeCompare(b.type.name)
    },
    {
      title: t('event_category'),
      dataIndex: ['type', 'category', "name"],
      sorter: (a, b) => a.type.category.name.localeCompare(b.type.category.name)
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
      render: () => 0
    },
    {
      title: t('separated_photos'),
      dataIndex: ['temp'],
      render: () => 0
    },
    {
      title: t('size'),
      dataIndex: ['temp'],
      render: () => "0 MB"
    },
    {
      title: t('actions'),
      key: 'actions',
      align: 'center',
      fixed: 'right',
      width: 120,
      render: (_, record) => <ActionButtons record={record}/>
    }
  ];

  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
    fetchEvents(1, pagination.pageSize!, searchTermDebounce)
      .then(res => {
        if (res.status === ApiStatus.SUCCESS) {
          setPagination(prev => ({
            ...prev,
            total: res.meta.total,
          }));
        }
      })
  }, [searchTermDebounce]);

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, any>,
    sorter: SorterResult<EventType> | SorterResult<EventType>[]
  ) => {
    if (
      newPagination.current !== pagination.current ||
      newPagination.pageSize !== pagination.pageSize
    ) {
      setPagination(newPagination);
      fetchEvents(newPagination.current!, newPagination.pageSize!, searchTermDebounce).then(data => {
        setPagination(prev => ({...prev, total: data.meta.total}));
      });
    }
  };

  const handleClose = () => {
    setEditingEvent(undefined)
    setOpen(false)
  }

  return (
    <>
      <PageHeader title={t('events')}/>

      <Card variant="outlined" className="shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
        <Flex justify="end" align="center" style={{marginBottom: 16}}>
          <Flex gap="small">
            <Search placeholder={t('search_event')} style={{width: 240}} loading={loadingEvents}
                    onChange={e => setSearchTerm(e.target.value)}/>
            <Button type="primary" onClick={() => setOpen(true)}>{t('add_new_event')}</Button>
          </Flex>
        </Flex>
        <Table<EventType>
          rowKey="id"
          columns={columns}
          dataSource={events}
          bordered={true}
          loading={loadingEvents}
          scroll={{y: 560, x: 'max-content'}}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['15', '30', '50', '100'],
            showTotal: (total, range) => t('pagination', {start: range[0], end: range[1], total, count: total}),
          }}
          onChange={handleTableChange}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span>
            {t('no_event_found')}
          </span>
                }
              >
                <Button type="primary" onClick={() => setOpen(true)}>{t('add_new_event')}</Button>
              </Empty>
            ),
          }}
        />

        <ManageEventModal
          open={open}
          event={editingEvent}
          onCreate={handleClose}
          onEdit={handleClose}
          onCancel={() => setOpen(false)}
        />
      </Card>
    </>
  );
}
