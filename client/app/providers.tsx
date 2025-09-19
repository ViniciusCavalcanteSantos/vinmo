'use client'

import {AntdRegistry} from "@ant-design/nextjs-registry";
import {PropsWithChildren} from "react";
import {ConfigProvider, theme} from "antd";
import ptBR from 'antd/locale/pt_BR';

export default function Providers({children}: PropsWithChildren) {
  return (
    <AntdRegistry>
      <ConfigProvider
        locale={ptBR}
        theme={{
        }}
      >
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
}
