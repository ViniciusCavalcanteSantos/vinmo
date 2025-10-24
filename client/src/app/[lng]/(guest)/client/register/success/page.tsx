"use client";

import React from 'react';
import {Button, Result} from 'antd';
import {useRouter} from 'next/navigation';
import {useT} from "@/i18n/client";


const ManageClientPage: React.FC = () => {
  const {t} = useT();
  const router = useRouter();

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 h-full flex items-center justify-center">
      <Result
        status="success"
        title={t("registration_completed")}
        subTitle={t("you_are_now_registered_in_the_event")}
        extra={[
          <Button
            type="primary"
            key="home"
            onClick={() => router.push("/")}
          >
            {t("finish")}
          </Button>,
        ]}
      />
    </main>
  );
};

export default ManageClientPage;