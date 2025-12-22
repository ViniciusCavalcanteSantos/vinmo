"use client"

import {Button, Card, Table} from "antd";
import React, {useMemo, useState} from "react";
import Search from "antd/es/input/Search";
import {useT} from "@/i18n/client";
import Client from "@/types/Client";
import {useUser} from "@/contexts/UserContext";
import {ExpandableConfig, TableRowSelection} from "antd/es/table/interface";
import {useClients} from "@/lib/queries/clients/useClients";
import {useRemoveClient} from "@/lib/queries/clients/useRemoveClient";
import PageHeader from "@/components/common/layout/PageHeader";
import AssignModals from "@/components/features/app/clients/ClientManager/_modals/AssignModals";
import CreateRegisterLinkModal from "@/components/features/app/clients/ClientManager/_modals/CreateRegisterLinkModal";
import {useServerTable} from "@/hooks/useServerTable";
import {getClientTableColumns} from "@/components/features/app/clients/ClientManager/_config/getClientTableColumns";
import {ClientExpandedDetails} from "@/components/features/app/clients/ClientManager/_components/ClientExpandedDetails";
import RegisterTypeModal from "@/components/features/app/clients/ClientManager/_modals/RegisterTypeModal";
import {useClientAssignments} from "@/lib/queries/assignments/useClientAssignments";
import {useAssignController} from "@/components/features/app/clients/ClientManager/_hooks/useAssignController";

export default function ClientManager() {
  const {t} = useT();
  const [openModalRegister, setOpenModalRegister] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const {defaultDateFormat} = useUser();

  const {queryParams, searchProps, getTableProps} = useServerTable<Client>()

  const {
    data: data,
    isLoading,
    isError,
    error,
    refetch
  } = useClients(queryParams.searchTerm, queryParams.page, queryParams.pageSize)
  const removeClient = useRemoveClient()

  const [openModalGenerateLink, setOpenModalGenerateLink] = useState(false);

  const assignCtrl = useAssignController();
  const assignmentsQuery = useClientAssignments(
    assignCtrl.state.targetSingleId,
    assignCtrl.state.type === 'single' && assignCtrl.state.isOpen
  );

  const columns = useMemo(() => getClientTableColumns({
    t: t,
    onAssign: assignCtrl.actions.openSingle,
    onDelete: (client) => removeClient.mutate(client.id),
    defaultDateFormat: defaultDateFormat
  }), [t, removeClient, defaultDateFormat, assignCtrl.actions.openSingle]);

  const expandableConfig = useMemo<ExpandableConfig<Client>>(() => ({
    expandedRowRender: (record) => <ClientExpandedDetails record={record}/>,
    rowExpandable: (record) => !!(record.address || record.guardian),
  }), []);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<Client> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const header = hasSelected ? () => {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <h3 className="mr-4 font-medium">{t('items_selected', {count: selectedRowKeys.length})}</h3>

        <Button type="primary" onClick={() => assignCtrl.actions.openBulk(selectedRowKeys as number[])}>
          {t('assign')}
        </Button>

        <Button color="gold" variant="solid"
                onClick={() => assignCtrl.actions.openUnassign(selectedRowKeys as number[])}>
          {t('unassign')}
        </Button>
      </div>
    );
  } : undefined;


  return (
    <>
      <PageHeader title={t('clients')}/>

      <Card variant="outlined" className="shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col sm:flex-row sm:justify-end gap-4 mb-4">
          <Search {...searchProps} placeholder={t('search_client')} className="w-full sm:max-w-60" loading={isLoading}/>
          <Button type="primary" onClick={() => setOpenModalRegister(true)} className="w-full sm:w-auto">
            {t('add_new_client')}
          </Button>
        </div>

        <Table<Client>
          {...getTableProps({
            data: data?.clients,
            total: data?.meta.total,
            isLoading: isLoading,
            isError: isError,
            error: error,
            refetch: refetch,
            onAdd: () => setOpenModalRegister(true),
            addText: t('add_new_client'),
            emptyText: t('no_client_found')
          })}
          rowKey="id"
          title={header}
          rowSelection={rowSelection}
          columns={columns}
          expandable={expandableConfig}
          bordered={true}
          loading={isLoading}
          scroll={{y: 560, x: 'max-content'}}
        />
      </Card>

      <CreateRegisterLinkModal open={openModalGenerateLink} handleClose={() => setOpenModalGenerateLink(false)}/>

      <RegisterTypeModal
        open={openModalRegister}
        onCancel={() => setOpenModalRegister(false)}
        onGenerateLink={() => setOpenModalGenerateLink(true)}
      />

      <AssignModals
        openModalAssign={assignCtrl.state.isOpen}
        handleClose={assignCtrl.actions.close}
        clientIds={assignCtrl.state.clientIds}
        type={assignCtrl.state.type}
        initialAssignments={assignmentsQuery.data?.assignments ?? []}/>
    </>
  );
}
