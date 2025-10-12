"use client"

import {
  Button,
  Card,
  Empty,
  Flex,
  Form,
  Image,
  Modal,
  Select,
  Space,
  Table,
  TableColumnsType,
  TablePaginationConfig,
  Tooltip
} from "antd";
import React, {useEffect, useState} from "react";
import Search from "antd/es/input/Search";
import {useT} from "@/i18n/client";
import ClientType from "@/types/ClientType";
import {DeleteOutlined, EditOutlined, EyeOutlined, LinkOutlined} from "@ant-design/icons";
import {useDebounce} from "react-use";
import {useClients} from "@/contexts/ClientsContext";
import {ApiStatus} from "@/types/ApiResponse";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import {useUser} from "@/contexts/UserContext";
import dayjs from "dayjs";
import {useRouter} from "next/navigation";
import EventSelector from "@/components/EventSelector";
import {createAssignment, fetchAssignments} from "@/lib/database/Assignment";
import {useNotification} from "@/contexts/NotificationContext";

export default function Page() {
  const {t} = useT();
  const notification = useNotification();
  const {clients, fetchClients, loadingClients, removeClient} = useClients();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermDebounce, setSearchTermDebounce] = useState("");
  const [openModalRegister, setOpenModalRegister] = useState(false);
  const [openModalAssignClient, setOpenModalAssignClient] = useState(false);
  const [assignments, setAssignments] = useState<number[]>([]);
  const [clientId, setClientId] = useState<number | null>(null);

  const {defaultDateFormat} = useUser();
  const router = useRouter();
  const [form] = Form.useForm();

  useDebounce(() => {
    setSearchTermDebounce(searchTerm);
  }, 300, [searchTerm])

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  const openModalAssignment = (clientId: number) => {
    fetchAssignments(clientId)
      .then(res => {
        setAssignments(res.assignments)
        setClientId(clientId)
        setOpenModalAssignClient(true)
      })
  }

  const closeModalAssignClient = () => {
    setAssignments([])
    setClientId(null)
    setOpenModalAssignClient(false)
  }

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
      <Tooltip title={t('assign')} destroyOnHidden>
        <Button
          type="text"
          shape="circle"
          icon={<LinkOutlined/>}
          onClick={() => openModalAssignment(record.id)}
        />
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
      sorter: (a, b) => {
        const dateA = a.birthdate ? dayjs(a.birthdate).valueOf() : 0;
        const dateB = b.birthdate ? dayjs(b.birthdate).valueOf() : 0;
        return dateA - dateB;
      },
      render: (_, record) => (record.birthdate ? dayjs(record.birthdate).format(defaultDateFormat) : '')
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

  const handleOk = () => {
    form.validateFields()
      .then(async ({register_type}: any) => {
        if (register_type === 'manual') {
          router.push('/clients/manage/new');
        } else if (register_type === 'image_name') {
          router.push('/clients/create/by-image-name');
        }
      })
  }

  const handleAssignChange = (values: number[]) => {
    setAssignments(values);
  }

  const handleAssign = async () => {
    if (!clientId) return;
    const res = await createAssignment(clientId, assignments)
    if (res.status !== ApiStatus.SUCCESS) {
      notification.warning({message: res.message})
    }

    notification.success({message: res.message})
    closeModalAssignClient()
  }

  return (
    <>
      <PageHeader title={t('clients')}/>

      <Card variant="outlined" className="shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
        <Flex justify="end" align="center" style={{marginBottom: 16}}>
          <Flex gap="small">
            <Search placeholder={t('search_client')} style={{width: 240}} loading={loadingClients}
                    onChange={e => setSearchTerm(e.target.value)}/>
            <Button type="primary" onClick={() => setOpenModalRegister(true)}>
              {t('add_new_client')}
            </Button>
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
                <Button type="primary" onClick={() => setOpenModalRegister(true)}>{t('add_new_client')}</Button>
              </Empty>
            ),
          }}
        />
      </Card>

      <Modal
        open={openModalRegister}
        title={t('choose_register_type')}
        okText={t('go')}
        onCancel={() => setOpenModalRegister(false)}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          <Form.Item name="register_type" label={t('register_type')}
                     rules={[{required: true, message: t('select_a_register_type')}]}>
            <Select placeholder={t('select_a_register_type')}
                    options={[
                      {value: "manual", label: t("manual_registration")},
                      {value: "image_name", label: t("by_image_name")},
                      {value: "link", label: t("by_link")}
                    ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={openModalAssignClient}
        title={t('assign_client_to_event')}
        okText={t('assign')}
        onCancel={closeModalAssignClient}
        onOk={handleAssign}
      >
        <EventSelector value={assignments} onChange={handleAssignChange}/>
      </Modal>
    </>
  );
}
