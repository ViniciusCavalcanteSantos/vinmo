"use client"

import {Button, Card, Empty, Flex, Space, Table, TableColumnsType, TablePaginationConfig, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {SorterResult, TableRowSelection} from "antd/es/table/interface";
import Search from "antd/es/input/Search";
import {useT} from "@/i18n/client";
import EventType from "@/types/EventType";
import {DeleteOutlined, EditOutlined, EyeOutlined, UploadOutlined} from "@ant-design/icons";
import {useDebounce} from "react-use";
import {useEvents} from "@/contexts/EventsContext";
import {ApiStatus} from "@/types/ApiResponse";
import ManageEventModal from "@/components/ManageEventModal";

export default function Page() {
  const {t} = useT();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [open, setOpen] = useState(false);
  const {events, fetchEvents, loadingEvents, removeEvent} = useEvents();
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermDebounce, setSearchTermDebounce] = useState("");
  useDebounce(() => {
    setSearchTermDebounce(searchTerm);
  }, 300, [searchTerm])

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

  const columns: TableColumnsType<EventType> = [
    {title: t('event_name'), dataIndex: ['type', "name"]},
    {title: t('event_category'), dataIndex: ['type', 'category', "name"]},
    {title: t('event_date'), dataIndex: 'eventDate'},
    {title: t('start_time'), dataIndex: 'startTime'},
    {title: t('uploaded_photos'), dataIndex: ['temp'], render: () => 0},
    {title: t('separated_photos'), dataIndex: ['temp'], render: () => 0},
    {title: t('size'), dataIndex: ['temp'], render: () => "0 MB"},
    {
      title: t('actions'),
      key: 'actions',
      align: 'center',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title={t('view')}>
            <Button
              type="text"
              shape="circle"
              icon={<EyeOutlined/>}
              onClick={() => (record)}
            />
          </Tooltip>
          <Tooltip title={t('edit')}>
            <Button
              type="text"
              shape="circle"
              icon={<EditOutlined/>}
              onClick={() => editEvent(record)}
            />
          </Tooltip>
          <Tooltip title={t('send_photo')}>
            <Button
              type="text"
              shape="circle"
              icon={<UploadOutlined/>}
              onClick={() => (record)}
            />
          </Tooltip>
          <Tooltip title={t('delete')}>
            <Button
              type="text"
              shape="circle"
              danger
              icon={<DeleteOutlined/>}
              onClick={() => removeEvent(record.id)}
            />
          </Tooltip>
        </Space>)
    }
    // {title: 'Events', dataIndex: 'events'},
    // {title: 'Photos uploaded', dataIndex: 'photos_uploaded'},
    // {title: 'Photos sorted', dataIndex: 'photos_sorted'},
    // {title: 'Size', dataIndex: 'size'},
  ];

  const fetchData = async () => {
    setLoadingSearch(true);
    const res = await fetchEvents(pagination.current, pagination.pageSize!, searchTermDebounce);
    if (res.status === ApiStatus.SUCCESS) {
      setPagination(prev => ({
        ...prev,
        total: res.meta.total,
      }));
    }
    setLoadingSearch(false)
  }

  useEffect(() => {
    fetchData();
  }, [searchTermDebounce]);

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, any>,
    sorter: SorterResult<EventType> | SorterResult<EventType>[]
  ) => {
    setPagination(newPagination);
    fetchEvents(newPagination.current!, newPagination.pageSize!, searchTerm).then(data => {
      setPagination(prev => ({...prev, total: data.meta.total}));
    });
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<EventType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const handleClose = () => {
    setEditingEvent(undefined)
    setOpen(false)
  }
  const handleCreate = () => handleClose()
  const handleEdit = () => handleClose()
  const handleDelete = () => handleClose()

  return (
    <Card variant="outlined" className="shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
      <Flex justify="space-between" align="center" style={{marginBottom: 16}}>
        <h2 className="text-lg font-semibold">
          {t('events')}
        </h2>
        <Flex gap="small">
          <Search placeholder={t('search_event')} style={{width: 240}} loading={loadingSearch}
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
        scroll={{x: 'max-content'}}
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
        // event={editingEvent}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onCancel={() => setOpen(false)}
      />
    </Card>
  );
}
