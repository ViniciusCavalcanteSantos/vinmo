"use client"

import {App, Button, Card, Empty, Flex, Space, Table, TableColumnsType, TablePaginationConfig, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {SorterResult, TableRowSelection} from "antd/es/table/interface";
import Search from "antd/es/input/Search";
import ManageContractModal from "@/components/ManageContractModal";
import {useT} from "@/i18n/client";
import ContractType from "@/types/ContractType";
import {DeleteOutlined, EditOutlined, ExclamationCircleFilled} from "@ant-design/icons";
import {useDebounce} from "react-use";
import {useContracts} from "@/contexts/ContractsContext";
import {ApiStatus} from "@/types/ApiResponse";
import {Trans} from "react-i18next";

export default function Page() {
  const {t} = useT();
  const {modal} = App.useApp();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [open, setOpen] = useState(false);
  const {contracts, fetchContracts, loadingContracts, removeContract} = useContracts();
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

  const handleRemove = (record: ContractType) => {
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
        await removeContract(record.id);
      },
    });
  };

  const ActionButtons = ({record}: { record: ContractType }) => (
    <Space size="middle">
      <Tooltip title={t('edit')} destroyOnHidden>
        <Button
          type="text"
          shape="circle"
          icon={<EditOutlined/>}
          onClick={() => editContract(record)}
        />
      </Tooltip>
      <Tooltip title={t('delete')} destroyOnHidden>
        <Button
          type="text"
          shape="circle"
          danger
          icon={<DeleteOutlined/>}
          onClick={() => handleRemove(record)}
        />
      </Tooltip>
    </Space>
  );

  const columns: TableColumnsType<ContractType> = [
    {
      title: t('code'),
      dataIndex: 'code',
      sorter: (a, b) => a.code.localeCompare(b.code)
    },
    {
      title: t('title'),
      dataIndex: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title)
    },
    {
      title: t('city'),
      dataIndex: ['address', 'city'],
      sorter: (a, b) => a.address.city.localeCompare(b.address.city)
    },
    {
      title: t('uf'),
      dataIndex: ['address', 'state'],
      sorter: (a, b) => a.address.state.localeCompare(b.address.state)
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
      current: 1,
    }));
    fetchContracts(1, pagination.pageSize!, searchTermDebounce)
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
    sorter: SorterResult<ContractType> | SorterResult<ContractType>[]
  ) => {
    if (
      newPagination.current !== pagination.current ||
      newPagination.pageSize !== pagination.pageSize
    ) {
      setPagination(newPagination);
      fetchContracts(newPagination.current!, newPagination.pageSize!, searchTerm)
        .then(data => {
          setPagination(prev => ({...prev, total: data.meta.total}));
        });
    }
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

        <Button color="danger" variant="solid" onClick={() => handleDelete()}>Excluir</Button>
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
          <Search placeholder={t('search_contract')} style={{width: 240}} loading={loadingContracts}
                  onChange={e => setSearchTerm(e.target.value)}/>
          <Button type="primary" onClick={() => setOpen(true)}>{t('add_new_contract')}</Button>
        </Flex>
      </Flex>
      <Table<ContractType>
        rowKey="id"
        title={header}
        columns={columns}
        dataSource={contracts}
        bordered={true}
        loading={loadingContracts}
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
        onCancel={handleClose}
      />
    </Card>
  );
}
