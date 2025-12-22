import React from "react";
import {useT} from "@/i18n/client";
import Client from "@/types/Client";

export const ClientExpandedDetails = ({record}: { record: Client }) => {
  const {t} = useT();

  return (
    <div className="p-4 flex flex-wrap gap-4">
      {record.address && (
        <div>
          <p><strong>{t('street')}:</strong> {record.address.street}</p>
          <p><strong>{t('number')}:</strong> {record.address.number}</p>
          <p><strong>{t('neighborhood')}:</strong> {record.address.neighborhood}</p>
          <p><strong>{t('city')}:</strong> {record.address.city}</p>
          <p><strong>{t('state')}:</strong> {record.address.stateName}</p>
        </div>
      )}
      {record.guardian?.name && (
        <div>
          <p><strong>{t('guardian_name')}:</strong> {record.guardian.name}</p>
          <p><strong>{t('guardian_type')}:</strong> {t(record.guardian.type)}</p>
          <p><strong>{t('guardian_phone')}:</strong> {record.guardian.phone}</p>
          <p><strong>{t('guardian_email')}:</strong> {record.guardian.email}</p>
        </div>
      )}
    </div>
  );
};