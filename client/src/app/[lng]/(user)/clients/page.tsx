"use client"

import {Button, Card, Empty, Flex, Image, Space, Table, TableColumnsType, TablePaginationConfig, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {SorterResult} from "antd/es/table/interface";
import Search from "antd/es/input/Search";
import {useT} from "@/i18n/client";
import ClientType from "@/types/ClientType";
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import {useDebounce} from "react-use";
import {useClients} from "@/contexts/ClientsContext";
import {ApiStatus} from "@/types/ApiResponse";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import {useUser} from "@/contexts/UserContext";
import dayjs from "dayjs";

export default function Page() {
  const {t} = useT();
  const {clients, fetchClients, loadingClients, removeClient} = useClients();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermDebounce, setSearchTermDebounce] = useState("");
  const {defaultDateFormat} = useUser();
  useDebounce(() => {
    setSearchTermDebounce(searchTerm);
  }, 300, [searchTerm])

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  const ActionButtons = ({record}: { record: ClientType }) => (
    <Space size="middle">
      <Tooltip title={t('edit')} destroyOnHidden>
        <Link href={`/clients/manage/${record.id}`}>
          <Button
            type="text"
            shape="circle"
            icon={<EditOutlined/>}
          />
        </Link>
      </Tooltip>
      <Tooltip title={t('delete')} destroyOnHidden>
        <Button
          type="text"
          shape="circle"
          danger
          icon={<DeleteOutlined/>}
          onClick={() => removeClient(record.id)}
        />
      </Tooltip>
    </Space>
  )

  const columns: TableColumnsType<ClientType> = [
    {
      title: t('name'),
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, record) => (
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <Image
            className="rounded-avatar"
            src={record.profileUrl}
            width={32}
            height={32}
            style={{cursor: 'pointer'}}
            preview={{mask: <EyeOutlined/>}}
          />
          <span>{record.name}</span>
        </div>
      ),
    },
    {
      title: t('code'),
      dataIndex: 'code',
      sorter: (a, b) => a.code?.localeCompare(b.code ?? "") ?? 1
    },
    {
      title: t('birthdate'),
      dataIndex: 'birthdate',
      render: (_, record) => (dayjs(record.birthdate).format(defaultDateFormat))
    },
    {
      title: t('phone'),
      dataIndex: 'phone',
      sorter: (a, b) => a.phone?.localeCompare(b.phone ?? "") ?? 1
    },
    {
      title: t('street'),
      dataIndex: ['address', 'street'],
      sorter: (a, b) => a.address?.street.localeCompare(b.address?.street ?? "") ?? 1
    },
    {
      title: t('number'),
      dataIndex: ['address', 'number'],
      sorter: (a, b) => a.address?.number.localeCompare(b.address?.number ?? "") ?? 1
    },
    {
      title: t('neighborhood'),
      dataIndex: ['address', 'neighborhood'],
      sorter: (a, b) => a.address?.neighborhood.localeCompare(b.address?.neighborhood ?? "") ?? 1
    },
    {
      title: t('city'),
      dataIndex: ['address', 'city'],
      sorter: (a, b) => a.address?.city.localeCompare(b.address?.city ?? "") ?? 1
    },
    {
      title: t('state'),
      dataIndex: ['address', 'state'],
      sorter: (a, b) => a.address?.state.localeCompare(b.address?.state ?? "") ?? 1
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
    fetchClients(1, pagination.pageSize!, searchTermDebounce)
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
    sorter: SorterResult<ClientType> | SorterResult<ClientType>[]
  ) => {
    if (
      newPagination.current !== pagination.current ||
      newPagination.pageSize !== pagination.pageSize
    ) {
      setPagination(newPagination);
      fetchClients(newPagination.current!, newPagination.pageSize!, searchTermDebounce).then(data => {
        setPagination(prev => ({...prev, total: data.meta.total}));
      });
    }
  };

  return (
    <>
      <PageHeader title={t('clients')}/>

      <Card variant="outlined" className="shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
        <Flex justify="end" align="center" style={{marginBottom: 16}}>
          <Flex gap="small">
            <Search placeholder={t('search_client')} style={{width: 240}} loading={loadingClients}
                    onChange={e => setSearchTerm(e.target.value)}/>
            <Link href="/clients/manage/new">
              <Button type="primary">
                {t('add_new_client')}
              </Button>
            </Link>
          </Flex>
        </Flex>
        <Table<ClientType>
          rowKey="id"
          columns={columns}
          dataSource={clients}
          bordered={true}
          loading={loadingClients}
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
            {t('no_client_found')}
          </span>
                }
              >
                <Link href="/clients/manage/new">
                  <Button type="primary">{t('add_new_client')}</Button>
                </Link>
              </Empty>
            ),
          }}
        />
      </Card>
    </>
  );
}
