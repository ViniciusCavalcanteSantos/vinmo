'use client'

import {FloatButton} from "antd";
import {useTheme} from "@/contexts/AppThemeContext";
import {MoonOutlined, SunOutlined} from "@ant-design/icons";
import React from "react";

export default function Providers({children}: { children: React.ReactNode }) {
  const {theme, setTheme} = useTheme()

  return (
    <>
      {children}

      <FloatButton
        onClick={() => theme === 'dark' ? setTheme('light') : setTheme('dark')}
        icon={theme === 'dark' ? <SunOutlined/> : <MoonOutlined/>}
      />
    </>
  );
}
