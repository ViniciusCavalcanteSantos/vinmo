'use client'

import {AntdRegistry} from "@ant-design/nextjs-registry";
import {PropsWithChildren} from "react";
import {ConfigProvider} from "antd";
import {themeAntd} from "@/theme";
import {NotificationProvider} from "@/contexts/NotificationContext";
import en from 'antd/locale/en_US';
import ptBR from 'antd/locale/pt_BR';
import {Locale} from "antd/es/locale";


export default function Providers({children, lang}: PropsWithChildren<{ lang: string }>) {
  const langMap: Record<string, Locale>  = {
    'en': en,
    'pt-BR': ptBR
  }

  return (
    <AntdRegistry>
      <ConfigProvider
        locale={langMap[lang] ?? en}
        theme={{
          token: themeAntd
        }}
      >
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </ConfigProvider>
    </AntdRegistry>
  );
}
