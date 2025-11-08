'use client'

import {AntdRegistry} from "@ant-design/nextjs-registry";
import {PropsWithChildren, useMemo} from "react";
import {App, ConfigProvider, theme} from "antd";
import {themeAntdDark, themeAntdLight} from "@/theme";
import {NotificationProvider} from "@/contexts/NotificationContext";
import en from 'antd/locale/en_US';
import ptBR from 'antd/locale/pt_BR';
import {Locale} from "antd/es/locale";
import {ThemeProvider, useTheme} from "@/contexts/AppThemeContext";


export default function Providers({children, lang}: PropsWithChildren<{ lang: string }>) {

  return (
    <AntdRegistry>
      <ThemeProvider>
        <ConfigProviderWrapper lang={lang}>
          {children}
        </ConfigProviderWrapper>
      </ThemeProvider>
    </AntdRegistry>
  );
}

function ConfigProviderWrapper({children, lang}: PropsWithChildren<{ lang: string }>) {
  const {resolved} = useTheme()

  const algorithm = useMemo(
    () => (resolved === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm),
    [resolved]
  )

  const langMap: Record<string, Locale> = {
    'en': en,
    'pt-BR': ptBR
  }

  return (
    <ConfigProvider
      locale={langMap[lang] ?? en}
      theme={{
        algorithm: algorithm,
        token: resolved === 'dark' ? themeAntdDark : themeAntdLight,
        cssVar: true
      }}
    >
      <App className="h-full">
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </App>
    </ConfigProvider>
  )
}
