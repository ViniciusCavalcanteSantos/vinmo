"use client"

import {Button, Card, Empty, Flex, Table, TableColumnsType} from "antd";
import {useEffect, useState} from "react";
import {TableRowSelection} from "antd/es/table/interface";
import Search from "antd/es/input/Search";
import CreateContractModal from "@/components/CreateContractModal";
import {useT} from "@/i18n/client";
import {getContracts} from "@/lib/database/Contract";
import ContractType from "@/types/ContractType";
import {ApiStatus} from "@/types/ApiResponse";

export default function Page() {
  const { t } = useT();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [open, setOpen] = useState(false);
  const [contracts, setContracts] = useState<ContractType[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: TableColumnsType<ContractType> = [
    {title: t('code'), dataIndex: 'code'},
    {title: t('title'), dataIndex: 'title'},
    {title: t('city'), dataIndex: ['address', 'city']},
    {title: t('uf'), dataIndex: ['address', 'state']},
    // {title: 'Events', dataIndex: 'events'},
    // {title: 'Photos uploaded', dataIndex: 'photos_uploaded'},
    // {title: 'Photos sorted', dataIndex: 'photos_sorted'},
    // {title: 'Size', dataIndex: 'size'},
  ];

  useEffect(() => {
    (async() => {
      setLoading(true)
      const res = await getContracts()
      if(res.status === ApiStatus.SUCCESS) {
        setContracts(res.contracts)
        setLoading(false)
      }
    })()
  }, [])

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<ContractType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;
  const handleDelete = () => {}

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
          <Search placeholder={t('search_contract')} style={{width: 240}} loading={false}/>
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
        loading={loading}
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

      <CreateContractModal
        open={open}
        onCreate={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </Card>
  );
}
