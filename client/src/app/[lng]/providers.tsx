'use client'

import {AntdRegistry} from "@ant-design/nextjs-registry";
import {PropsWithChildren, useEffect, useMemo, useState} from "react";
import {App, ConfigProvider, theme} from "antd";
import {themeAntdDark, themeAntdLight} from "@/theme";
import {NotificationProvider} from "@/contexts/NotificationContext";
import en from 'antd/locale/en_US';
import ptBR from 'antd/locale/pt_BR';
import {Locale} from "antd/es/locale";
import {ThemeProvider, useTheme} from "@/contexts/AppThemeContext";
import {PhotonSpin} from "@/components/Fallback";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient()

export default function Providers({children, lang}: PropsWithChildren<{ lang: string }>) {

  return (
    <QueryClientProvider client={queryClient}>
      <AntdRegistry>
        <ThemeProvider>
          <ConfigProviderWrapper lang={lang}>
            {children}
          </ConfigProviderWrapper>
        </ThemeProvider>
      </AntdRegistry>
    </QueryClientProvider>
  );
}

function ConfigProviderWrapper({children, lang}: PropsWithChildren<{ lang: string }>) {
  const {resolved} = useTheme()
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {algorithm, token, isDark} = useMemo(
    () => {
      const currentTheme = mounted ? resolved : 'light';
      const isDark = currentTheme === 'dark';

      return {
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: isDark ? themeAntdDark : themeAntdLight,
        isDark
      }
    },
    [resolved, mounted]
  )

  if (!mounted) {
    return <div style={{visibility: 'hidden'}}>{children}</div>;
  }

  const langMap: Record<string, Locale> = {
    'en': en,
    'pt-BR': ptBR
  }

  return (
    <ConfigProvider
      key={isDark ? 'dark-provider' : 'light-provider'}
      locale={langMap[lang] ?? en}
      theme={{
        algorithm: algorithm,
        token: token,
        cssVar: {
          prefix: 'ant',
          key: 'ant'
        },
      }}
      spin={{
        indicator: <PhotonSpin size='default'/>
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
