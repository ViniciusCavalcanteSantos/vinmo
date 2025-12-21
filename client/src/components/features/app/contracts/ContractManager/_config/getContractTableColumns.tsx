import {TableColumnsType} from "antd";
import Contract from "@/types/Contract";
import React from "react";
import ActionButtons from "@/components/features/app/contracts/ContractManager/_components/ActionButtons";

interface GetColumnsProps {
  t: (key: string, options?: any) => string;
  onEdit: (contract: Contract) => void;
  onDelete: (contract: Contract) => void;
}

export const getContractTableColumns = (
  {
    t,
    onEdit,
    onDelete
  }: GetColumnsProps): TableColumnsType<Contract> => [
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
    title: t('state'),
    dataIndex: ['address', 'stateName'],
    sorter: (a, b) => a.address.stateName?.localeCompare(b.address?.stateName ?? "") ?? 0
  },
  {
    title: t('actions'),
    key: 'actions',
    align: 'center',
    fixed: 'right',
    width: 120,
    render: (_, record) => <ActionButtons record={record} onEdit={onEdit} onDelete={onDelete}/>
  }
];