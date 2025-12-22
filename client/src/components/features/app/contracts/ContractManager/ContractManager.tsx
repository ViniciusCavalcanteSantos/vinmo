"use client"

import {App, Button, Card, Table} from "antd";
import React, {useMemo, useState} from "react";
import {TableRowSelection} from "antd/es/table/interface";
import Search from "antd/es/input/Search";
import ManageContractModal from "@/components/features/app/contracts/ContractManager/_modals/ManageContractModal";
import {useT} from "@/i18n/client";
import Contract from "@/types/Contract";
import {ExclamationCircleFilled} from "@ant-design/icons";
import {Trans} from "react-i18next";
import {useContracts} from "@/lib/queries/contracts/useContracts";
import {useRemoveContract} from "@/lib/queries/contracts/useRemoveContract";
import PageHeader from "@/components/common/layout/PageHeader";
import {
  getContractTableColumns
} from "@/components/features/app/contracts/ContractManager/_config/getContractTableColumns";
import {useServerTable} from "@/hooks/useServerTable";

export default function ContractManager() {
  const {t} = useT();
  const {modal} = App.useApp();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [open, setOpen] = useState(false);

  const {queryParams, searchProps, getTableProps} = useServerTable<Contract>()

  const {
    data: data,
    isLoading,
    isError,
    error,
    refetch
  } = useContracts(queryParams.searchTerm, queryParams.page, queryParams.pageSize)
  const removeContract = useRemoveContract()

  const [editingContract, setEditingContract] = useState<Contract>();
  const editContract = (contract: Contract) => {
    setEditingContract(contract)
    setOpen(true)
  }

  const handleRemove = (record: Contract) => {
    modal.confirm({
      title: t('are_you_sure_to_delete_contract'),
      icon: <ExclamationCircleFilled/>,
      content: (
        <div>
          <p>
            <Trans
              i18nKey="delete_contract_confirmation"
              values={{label: `${record.code} - ${record.title}`}}
              components={{strong: <strong/>}}
            />
          </p>
          <br/>
          <p><strong>{t('associated_information_that_will_be_lost')}</strong></p>
          <ul>
            <li><strong>0</strong> {t('events')}</li>
            <li><strong>0</strong> {t('linked_clients')}</li>
            <li><strong>0</strong> {t('uploaded_photos')}</li>
          </ul>
        </div>
      ),
      okText: t('yes_delete'),
      okType: 'danger',
      cancelText: t('cancel'),
      async onOk() {
        removeContract.mutate(record.id);
      },
    });
  };

  const columns = useMemo(() => getContractTableColumns({
    t,
    onEdit: editContract,
    onDelete: handleRemove
  }), [t]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<Contract> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const handleClose = () => {
    setEditingContract(undefined)
    setOpen(false)
  }
  const handleCreate = () => handleClose()
  const handleEdit = () => handleClose()
  const handleDelete = () => handleClose()

  const header = hasSelected ? () => {
    return (
      <div className="flex items-center">
        <h3 className="mr-4 font-medium">{selectedRowKeys.length} Selecionados</h3>

        <Button color="danger" variant="solid" onClick={() => handleDelete()}>Excluir</Button>
      </div>
    );
  } : undefined;


  return (
    <>
      <PageHeader title={t('contracts')}/>

      <Card variant="outlined" className="shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col sm:flex-row sm:justify-end gap-4 mb-4">
          <Search
            {...searchProps}
            placeholder={t('search_contract')} className="w-full sm:max-w-60" loading={isLoading}
          />
          <Button type="primary" onClick={() => setOpen(true)} className="w-full sm:w-auto">
            {t('add_new_contract')}
          </Button>
        </div>

        <Table<Contract>
          {...getTableProps({
            data: data?.contracts,
            total: data?.meta.total,
            isLoading: isLoading,
            isError: isError,
            error: error,
            refetch: refetch,
            onAdd: () => setOpen(true),
            addText: t('add_new_contract'),
            emptyText: t('no_contract_found')
          })}
          rowKey="id"
          title={header}
          rowSelection={rowSelection}
          columns={columns}
          scroll={{y: 560, x: 'max-content'}}
          bordered
        />

        <ManageContractModal
          open={open}
          contract={editingContract}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onCancel={handleClose}
        />
      </Card>
    </>

  );
}
