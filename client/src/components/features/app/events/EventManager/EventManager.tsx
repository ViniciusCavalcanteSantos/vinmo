"use client"

import {Button, Card, Empty, Table, TablePaginationConfig} from "antd";
import React, {useMemo, useState} from "react";
import {SorterResult} from "antd/es/table/interface";
import Search from "antd/es/input/Search";
import {useT} from "@/i18n/client";
import Event from "@/types/Event";
import {useDebounce} from "react-use";
import ManageEventModal from "@/components/features/app/events/EventManager/_modals/ManageEventModal";
import {useUser} from "@/contexts/UserContext";
import {useEvents} from "@/lib/queries/events/useEvents";
import {useRemoveEvent} from "@/lib/queries/events/useRemoveEvent";
import ErrorEmpty from "@/components/common/ErrorEmpty";
import PageHeader from "@/components/common/layout/PageHeader";
import {getEventTableColumns} from "@/components/features/app/events/EventManager/_config/getEventTableColumns";

export default function EventManager() {
  const {t} = useT();
  const [open, setOpen] = useState(false);
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

  const {
    data: events,
    isLoading,
    isError,
    error,
    refetch
  } = useEvents(searchTermDebounce, pagination.current, pagination.pageSize, true);
  const removeEvent = useRemoveEvent()

  const [editingEvent, setEditingEvent] = useState<Event>();
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setOpen(true)
  }

  const handleDeleteEvent = (event: Event) => {
    removeEvent.mutate(event.id)
  }

  const columns = useMemo(() => getEventTableColumns({
    t,
    defaultDateFormat,
    onEdit: handleEditEvent,
    onDelete: handleDeleteEvent
  }), [t, defaultDateFormat]);

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, any>,
    sorter: SorterResult<Event> | SorterResult<Event>[]
  ) => {
    if (
      newPagination.current !== pagination.current ||
      newPagination.pageSize !== pagination.pageSize
    ) {
      setPagination(newPagination);
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
        <div className="flex flex-col sm:flex-row sm:justify-end gap-4 mb-4">
          <Search placeholder={t('search_event')} className="w-full sm:max-w-60" loading={isLoading}
                  onChange={e => setSearchTerm(e.target.value)}/>
          <Button type="primary" onClick={() => setOpen(true)} className="w-full sm:w-auto">
            {t('add_new_event')}
          </Button>
        </div>

        <Table<Event>
          rowKey="id"
          columns={columns}
          dataSource={events}
          bordered={true}
          loading={isLoading}
          scroll={{y: 560, x: 'max-content'}}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['15', '30', '50', '100'],
            showTotal: (total, range) => t('pagination', {start: range[0], end: range[1], total, count: total}),
          }}
          onChange={handleTableChange}
          locale={{
            emptyText: isError
              ? <ErrorEmpty error={error} onRetry={refetch}/>
              : (
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
          onCancel={handleClose}
        />
      </Card>
    </>
  );
}
