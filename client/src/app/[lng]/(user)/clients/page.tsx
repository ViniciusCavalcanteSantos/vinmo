"use client"

import {
  Button,
  Card,
  Checkbox,
  Divider,
  Empty,
  Flex,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Row,
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
import Client from "@/types/Client";
import {CopyOutlined, DeleteOutlined, EditOutlined, EyeOutlined, LinkOutlined} from "@ant-design/icons";
import {useDebounce} from "react-use";
import {useClients} from "@/contexts/ClientsContext";
import {ApiStatus} from "@/types/ApiResponse";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import {useUser} from "@/contexts/UserContext";
import dayjs from "dayjs";
import {useRouter} from "next/navigation";
import EventSelector from "@/components/EventSelector";
import {assignClient, assignClientBulk, fetchAssignments, unassignClientBulk} from "@/lib/database/Assignment";
import {useNotification} from "@/contexts/NotificationContext";
import {TableRowSelection} from "antd/es/table/interface";
import {generateRegisterLink} from "@/lib/database/Client";

export default function Page() {
  const {t} = useT();
  const {clients, fetchClients, loadingClients, removeClient} = useClients();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermDebounce, setSearchTermDebounce] = useState("");
  const [openModalRegister, setOpenModalRegister] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

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

  const [openModalGenerateLink, setOpenModalGenerateLink] = useState(false);

  const [openModalAssign, setOpenModalAssign] = useState(false);
  const [clientIds, setClientIds] = useState<number[]>([]);
  const [assignType, setAssignType] = useState<"single" | "bulk" | "unassign">("single");
  const [assignments, setAssignments] = useState<number[]>([]);

  const openAssignSingle = (clientId: number) => {
    setOpenModalAssign(true);
    setAssignType('single');
    setClientIds([clientId])
    setAssignments([])

    fetchAssignments(clientId)
      .then(res => {
        setAssignments(res.assignments)
      })
  }

  const openAssignBulk = () => {
    setOpenModalAssign(true);
    setAssignType('bulk');
    setClientIds(selectedRowKeys as number[])
    setAssignments([])
  }

  const openUnassignBulk = () => {
    setOpenModalAssign(true);
    setAssignType('unassign');
    setClientIds(selectedRowKeys as number[])
    setAssignments([])
  }

  const closeModalAssign = () => {
    setOpenModalAssign(false);
    setClientIds([])
    setAssignments([])
  }

  const ActionButtons = ({record}: { record: Client }) => (
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
          onClick={() => openAssignSingle(record.id)}
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

  const columns: TableColumnsType<Client> = [
    {
      title: t('name'),
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, record) => (
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <Image
            className="rounded-avatar"
            src={record.profile.thumb}
            width={32}
            height={32}
            style={{cursor: 'pointer'}}
            preview={{src: record.profile.web, mask: <EyeOutlined/>}}
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
      title: t('actions'),
      key: 'actions',
      align: 'center',
      fixed: 'right',
      width: 120,
      render: (_, record) => <ActionButtons record={record}/>
    }
  ];

  const expandedRowRender = (record: Client) => (
    <div className="p-4 flex flex-wrap gap-4">
      {record.address && <div>
          <p><strong>{t('street')}:</strong> {record.address?.street}</p>
          <p><strong>{t('number')}:</strong> {record.address?.number}</p>
          <p><strong>{t('neighborhood')}:</strong> {record.address?.neighborhood}</p>
          <p><strong>{t('city')}:</strong> {record.address?.city}</p>
          <p><strong>{t('state')}:</strong> {record.address?.stateName}</p>
      </div>}

      {record.guardian?.name && <div>
          <p><strong>{t('guardian_name')}:</strong> {record.guardian?.name}</p>
          <p><strong>{t('guardian_type')}:</strong> {t(record.guardian?.type)}</p>
          <p><strong>{t('guardian_phone')}:</strong> {record.guardian?.phone}</p>
          <p><strong>{t('guardian_email')}:</strong> {record.guardian?.email}</p>
      </div>}
    </div>
  );

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
        } else {
          setOpenModalRegister(false)
          setOpenModalGenerateLink(true)
        }
      })
  }


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
      <div className="flex items-center">
        <h3 className="mr-4 font-medium">{selectedRowKeys.length} Selecionados</h3>

        <Button type="primary" className="mr-2" onClick={() => openAssignBulk()}>
          {t('assign')}
        </Button>

        <Button color="gold" variant="solid" onClick={() => openUnassignBulk()}>
          {t('unassign')}
        </Button>

        {/*<Button color="danger" variant="solid" onClick={() => {*/}
        {/*}}>Excluir</Button>*/}
      </div>
    );
  } : undefined;


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
        <Table<Client>
          rowKey="id"
          title={header}
          rowSelection={rowSelection}
          columns={columns}
          expandable={{
            expandedRowRender, rowExpandable: (record) =>
              !!(record.address || record.guardian)
          }}
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

      <CreateRegisterLinkModal open={openModalGenerateLink} handleClose={() => setOpenModalGenerateLink(false)}/>

      <Modal
        open={openModalRegister}
        title={t('choose_register_type')}
        okText={t('go')}
        onCancel={() => setOpenModalRegister(false)}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical" name="form_in_modal_choose_register_type">
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

      <AssignModals openModalAssign={openModalAssign} handleClose={closeModalAssign} clientIds={clientIds}
                    type={assignType} initialAssignments={assignments}/>
    </>
  );
}

interface CreateRegisterLinkModalProps {
  open: boolean,
  handleClose: () => void,
}

function CreateRegisterLinkModal({open, handleClose}: CreateRegisterLinkModalProps) {
  const {t} = useT()

  const [loading, setLoading] = useState(false);
  const [openGenerated, setOpenGenerated] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('')

  const [form] = Form.useForm();
  const autoAssign = Form.useWatch('auto_assign', form);

  const [assignments, setAssignments] = useState<number[]>([]);

  const notification = useNotification();

  const handleOk = async () => {
    form.validateFields()
      .then(async (values) => {
        setLoading(true)

        values.assignments = assignments

        const res = await generateRegisterLink(values)
        if (res.link_id) {
          const link = process.env.NEXT_PUBLIC_APP_URL + `/client/register/${res.link_id}`
          handleClose()
          setGeneratedLink(link)
          setOpenGenerated(true)
        }
      })
      .finally(() => setLoading(false))
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink)
      .then(() => {
        notification.success({message: t('link_copied_to_clipboard')})
      })
      .catch(() => {
      })
  }

  const close = () => {
    form.resetFields()
    setLoading(false)
    setAssignments([])
    handleClose()
  }


  return (
    <>
      <Modal
        open={open}
        title={t('share_register_link')}
        okText={t('generate')}
        onCancel={close}
        onOk={handleOk}
        confirmLoading={loading}
        maskClosable={!loading}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" name="form_in_modal_generate_link">
          <Form.Item
            name="title"
            label={t('title')}
            style={{marginBottom: 10, marginRight: 10}}
            rules={[{required: true, message: t('enter_title')}]}
          >
            <Input placeholder={t('enter_title')}/>
          </Form.Item>

          <Form.Item
            name="max_registers" label={t('max_registers')}
            rules={[{required: true, message: t('enter_max_registers')}]}>
            <InputNumber placeholder={t('enter_max_registers')} min={1} max={999} maxLength={3} className="!w-full"/>
          </Form.Item>

          <Row gutter={[12, 8]}>
            <Form.Item
              name="require_address"
              valuePropName="checked"
              initialValue={false}
              style={{marginBottom: 10, marginRight: 10}}
            >
              <Checkbox>{t('require_address')}</Checkbox>
            </Form.Item>
            <Form.Item
              name="require_guardian_if_minor"
              valuePropName="checked"
              initialValue={false}
              style={{marginBottom: 10, marginRight: 10}}
            >
              <Checkbox>{t('require_guardian_if_minor')}</Checkbox>
            </Form.Item>

            {<Form.Item
              name="auto_assign"
              valuePropName="checked"
              initialValue={false}
              style={{marginBottom: 10}}
            >
              <Checkbox>{t('auto_assign')}</Checkbox>
            </Form.Item>}
          </Row>

          {autoAssign && (
            <>
              <Divider>{t('assign_client_to_event')}</Divider>

              <EventSelector value={assignments} onChange={(values) => setAssignments(values)}/>
            </>
          )}
        </Form>
      </Modal>

      <Modal
        open={openGenerated}
        title={t('copy_register_link')}
        okText={t('finish')}
        onOk={() => setOpenGenerated(false)}
        onCancel={() => setOpenGenerated(false)}
        cancelButtonProps={{style: {display: 'none'}}}
        destroyOnHidden
      >
        {generatedLink &&
            <Form.Item
                layout="vertical"
                label={t("generated_link_label")}>
                <Space.Compact className="w-full">
                    <Input
                        placeholder={t("no_link_generated")}
                        value={generatedLink}
                        readOnly
                        style={{width: 'calc(100% - 50px)'}}
                    />
                    <Tooltip
                        title={generatedLink ? t("copy_link") : t("generate_first")}>

                        <Button
                            style={{width: 50}}
                            icon={<CopyOutlined/>}
                            onClick={handleCopy}
                            disabled={!generatedLink}
                            aria-label={t("copy_link")}

                        />
                    </Tooltip>
                </Space.Compact>
            </Form.Item>
        }
      </Modal>
    </>
  )
}

interface AssignModalsProps {
  openModalAssign: boolean,
  handleClose: () => void,
  clientIds: number[],
  initialAssignments: number[],
  type: "single" | "bulk" | 'unassign'
}

function AssignModals({openModalAssign, handleClose, clientIds, type, initialAssignments = []}: AssignModalsProps) {
  const {t} = useT();
  const notification = useNotification();

  const [assignments, setAssignments] = useState<number[]>(initialAssignments);

  useEffect(() => {
    setAssignments(initialAssignments)
  }, [initialAssignments]);

  const handleAssignChange = (values: number[]) => {
    setAssignments(values);
  }

  const handleAssign = async () => {
    if (!clientIds.length) return;

    let res;
    if (type === "single") {
      res = await assignClient(clientIds[0], assignments)
    } else if (type === "bulk") {
      res = await assignClientBulk(clientIds, assignments)
    } else {
      res = await unassignClientBulk(clientIds, assignments)
    }

    if (res.status !== ApiStatus.SUCCESS) {
      notification.warning({message: res.message})
      return;
    }

    notification.success({message: res.message})
    handleClose()
  }

  let title;
  let okText;
  if (type === "single") {
    title = 'assign_client_to_event'
    okText = 'assign'
  } else if (type === "bulk") {
    title = 'assign_clients_to_events'
    okText = 'assign'
  } else {
    title = 'unassign_clients'
    okText = 'unassign'
  }

  return (
    <>
      <Modal
        open={openModalAssign}
        title={t(title)}
        okText={t(okText)}
        onCancel={handleClose}
        onOk={handleAssign}
        okButtonProps={{color: type === 'unassign' ? 'gold' : 'primary', variant: "solid"}}
      >
        <EventSelector value={assignments} onChange={handleAssignChange}/>
      </Modal>
    </>
  )
}
