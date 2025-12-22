"use client"

import {Button, Card, Table} from "antd";
import React, {useMemo, useState} from "react";
import Search from "antd/es/input/Search";
import {useT} from "@/i18n/client";
import Event from "@/types/Event";
import ManageEventModal from "@/components/features/app/events/EventManager/_modals/ManageEventModal";
import {useUser} from "@/contexts/UserContext";
import {useEvents} from "@/lib/queries/events/useEvents";
import {useRemoveEvent} from "@/lib/queries/events/useRemoveEvent";
import PageHeader from "@/components/common/layout/PageHeader";
import {getEventTableColumns} from "@/components/features/app/events/EventManager/_config/getEventTableColumns";
import {useServerTable} from "@/hooks/useServerTable";

export default function EventManager() {
  const {t} = useT();
  const [open, setOpen] = useState(false);

  const {defaultDateFormat} = useUser();
  const {queryParams, searchProps, getTableProps} = useServerTable<Event>()

  const {
    data: data,
    isLoading,
    isError,
    error,
    refetch
  } = useEvents(queryParams.searchTerm, queryParams.page, queryParams.pageSize, true);
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

  const handleClose = () => {
    setEditingEvent(undefined)
    setOpen(false)
  }

  return (
    <>
      <PageHeader title={t('events')}/>

      <Card variant="outlined" className="shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col sm:flex-row sm:justify-end gap-4 mb-4">
          <Search {...searchProps} placeholder={t('search_event')} className="w-full sm:max-w-60" loading={isLoading}/>
          <Button type="primary" onClick={() => setOpen(true)} className="w-full sm:w-auto">
            {t('add_new_event')}
          </Button>
        </div>

        <Table<Event>
          {...getTableProps({
            data: data?.events,
            total: data?.meta.total,
            isLoading: isLoading,
            isError: isError,
            error: error,
            refetch: refetch,
            onAdd: () => setOpen(true),
            addText: t('add_new_event'),
            emptyText: t('no_event_found')
          })}
          rowKey="id"
          columns={columns}
          bordered={true}
          loading={isLoading}
          scroll={{y: 560, x: 'max-content'}}
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
