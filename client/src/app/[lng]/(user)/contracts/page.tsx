"use client"

import {Button, Card, Empty, Flex, Space, Table, TableColumnsType, TablePaginationConfig, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {SorterResult, TableRowSelection} from "antd/es/table/interface";
import Search from "antd/es/input/Search";
import ManageContractModal from "@/components/ManageContractModal";
import {useT} from "@/i18n/client";
import ContractType from "@/types/ContractType";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {useDebounce} from "react-use";
import {useContracts} from "@/contexts/ContractsContext";
import {ApiStatus} from "@/types/ApiResponse";

export default function Page() {
  const {t} = useT();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [open, setOpen] = useState(false);
  const {contracts, fetchContracts, loadingContracts} = useContracts();
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

  const [editingContract, setEditingContract] = useState<ContractType>();
  const editContract = (contract: ContractType) => {
    setEditingContract(contract)
    setOpen(true)
  }

  const columns: TableColumnsType<ContractType> = [
    {title: t('code'), dataIndex: 'code'},
    {title: t('title'), dataIndex: 'title'},
    {title: t('city'), dataIndex: ['address', 'city']},
    {title: t('uf'), dataIndex: ['address', 'state']},
    {
      title: t('actions'),
      key: 'actions',
      align: 'center',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title={t('edit')}>
            <Button
              type="text"
              shape="circle"
              icon={<EditOutlined/>}
              onClick={() => editContract(record)}
            />
          </Tooltip>
          <Tooltip title={t('delete')}>
            <Button
              type="text"
              shape="circle"
              danger
              icon={<DeleteOutlined/>}
              onClick={() => (record)}
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
    const res = await fetchContracts(pagination.current, pagination.pageSize!, searchTermDebounce);
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
    sorter: SorterResult<ContractType> | SorterResult<ContractType>[]
  ) => {
    setPagination(newPagination);
    fetchContracts(newPagination.current!, newPagination.pageSize!, searchTerm).then(data => {
      setPagination(prev => ({...prev, total: data.meta.total}));
    });
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<ContractType> = {
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

        <Button color="danger" variant="solid" onClick={handleDelete}>Excluir</Button>
      </div>
    );
  } : undefined;

  return (
    <Card variant="outlined" className="shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
      <Flex justify="space-between" align="center" style={{marginBottom: 16}}>
        <h2 className="text-lg font-semibold">
          {t('contracts')}
        </h2>
        <Flex gap="small">
          <Search placeholder={t('search_contract')} style={{width: 240}} loading={loadingSearch}
                  onChange={e => setSearchTerm(e.target.value)}/>
          <Button type="primary" onClick={() => setOpen(true)}>{t('add_new_contract')}</Button>
        </Flex>
      </Flex>
      <Table<ContractType>
        rowKey="id"
        title={header}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={contracts}
        bordered={true}
        loading={loadingContracts}
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
            {t('no_contract_found')}
          </span>
              }
            >
              <Button type="primary" onClick={() => setOpen(true)}>{t('add_new_contract')}</Button>
            </Empty>
          ),
        }}
      />

      <ManageContractModal
        open={open}
        contract={editingContract}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onCancel={() => setOpen(false)}
      />
    </Card>
  );
}
