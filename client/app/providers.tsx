'use client'

import {AntdRegistry} from "@ant-design/nextjs-registry";
import {PropsWithChildren} from "react";
import {ConfigProvider} from "antd";
import ptBR from 'antd/locale/pt_BR';
import {themeAntd} from "@/theme";

export default function Providers({children}: PropsWithChildren) {
  return (
    <AntdRegistry>
      <ConfigProvider
        locale={ptBR}
        theme={{
          token: themeAntd
        }}
      >
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
}
