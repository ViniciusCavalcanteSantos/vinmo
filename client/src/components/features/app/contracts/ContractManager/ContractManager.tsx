"use client"

import {App, Button, Card, Empty, Table, TablePaginationConfig} from "antd";
import React, {useMemo, useState} from "react";
import {SorterResult, TableRowSelection} from "antd/es/table/interface";
import Search from "antd/es/input/Search";
import ManageContractModal from "@/components/features/app/contracts/ContractManager/_modals/ManageContractModal";
import {useT} from "@/i18n/client";
import Contract from "@/types/Contract";
import {ExclamationCircleFilled} from "@ant-design/icons";
import {useDebounce} from "react-use";
import {Trans} from "react-i18next";
import {useContracts} from "@/lib/queries/contracts/useContracts";
import {useRemoveContract} from "@/lib/queries/contracts/useRemoveContract";
import ErrorEmpty from "@/components/common/ErrorEmpty";
import PageHeader from "@/components/common/layout/PageHeader";
import {
  getContractTableColumns
} from "@/components/features/app/contracts/ContractManager/_config/getContractTableColumns";

export default function ContractManager() {
  const {t} = useT();
  const {modal} = App.useApp();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [open, setOpen] = useState(false);

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

  const {
    data: contracts,
    isLoading,
    isError,
    error,
    refetch
  } = useContracts(searchTermDebounce, pagination.current, pagination.pageSize)
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

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, any>,
    sorter: SorterResult<Contract> | SorterResult<Contract>[]
  ) => {
    if (
      newPagination.current !== pagination.current ||
      newPagination.pageSize !== pagination.pageSize
    ) {
      setPagination(newPagination);
    }
  };

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
          <Search placeholder={t('search_contract')} className="w-full sm:max-w-60" loading={isLoading}
                  onChange={e => setSearchTerm(e.target.value)}/>
          <Button type="primary" onClick={() => setOpen(true)} className="w-full sm:w-auto">
            {t('add_new_contract')}
          </Button>
        </div>


        <Table<Contract>
          rowKey="id"
          title={header}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={contracts}
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
                  description={t('no_contract_found')}
                >
                  <Button
                    type="primary"
                    onClick={() => setOpen(true)}
                  >
                    {t('add_new_contract')}
                  </Button>
                </Empty>
              )
          }}
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
