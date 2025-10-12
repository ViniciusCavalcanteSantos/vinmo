'use client'

import React, {useEffect, useMemo, useState} from 'react';
import {TreeSelect} from 'antd';
import {t} from "i18next";
import {fetchContracts} from "@/lib/database/Contract";
import {fetchEvents} from "@/lib/database/Event";
import ContractType from "@/types/ContractType";
import EventType from "@/types/EventType";
import {ApiStatus} from "@/types/ApiResponse";

interface EventSelectorProps {
  value?: number[];
  onChange?: (value: number[]) => void;
}

function EventSelector({value, onChange}: EventSelectorProps) {
  const [contracts, setContracts] = useState<ContractType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [contractsRes, eventsRes] = await Promise.all([
          fetchContracts(1, 100),
          fetchEvents(1, 100)
        ]);

        if (contractsRes.status === ApiStatus.SUCCESS) {
          setContracts(contractsRes.contracts);
        }

        if (eventsRes.status === ApiStatus.SUCCESS) {
          setEvents(eventsRes.events);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const treeData = useMemo(() => {
    return contracts.reduce((acc, contract) => {
      const contractEvents = events.filter(event => event.contractId === contract.id);
      if (contractEvents.length) {
        acc.push({
          title: contract.title,
          value: 'contract-' + contract.id,
          key: 'contract-' + contract.id,
          selectable: false,
          children: contractEvents.map(event => ({
            title: event.type.name,
            value: event.id,
            key: event.id,
          })),
        });
      }
      return acc;
    }, [] as any[])
  }, [contracts, events]);

  return (
    <>
      <TreeSelect
        showSearch={true}
        onSearch={(value: any) => console.log(value)}
        title={t('events')}
        style={{width: '100%'}}
        value={loading ? [] : value}
        onChange={onChange}
        treeData={treeData}
        treeCheckable={true}
        showCheckedStrategy={TreeSelect.SHOW_CHILD}
        placeholder={t('select_events')}
        treeDefaultExpandAll
        multiple
        loading={loading}
        allowClear
      />
    </>
  );
};

export default EventSelector;