'use client'

import User from "@/types/User";
import React, {useEffect, useMemo, useState} from "react";
import {Button, Divider, Dropdown} from "antd";
import {LogoutOutlined, MoonOutlined, SunOutlined, UserOutlined} from "@ant-design/icons";
import UserAvatar from "@/components/UserAvatar";
import Link from "next/link";
import {useT} from "@/i18n/client";
import {useUser} from "@/contexts/UserContext";
import {useTheme} from "@/contexts/AppThemeContext";

function UserAvatarDropdown({user}: { user: User | null }) {
  const {logout} = useUser();
  const [mounted, setMounted] = useState(false);
  const {t} = useT();
  const {theme, setTheme} = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => logout();

  const dropdownContent = useMemo(() => {
    if (!user) return <></>;

    return (
      <div
        className="flex flex-col gap-1 min-w-[260px] rounded-2xl
                   bg-ant-bg-elevated border border-ant-border-sec
                   text-ant-text shadow-ant-2"
      >
        <div className="flex items-center gap-x-2 p-4 pb-0">
          <UserAvatar user={user} size={32}/>
          <div>
            <div className="font-semibold text-ant-text">{user.name}</div>
            <div className="text-sm text-ant-text-secondary">{user.email}</div>
          </div>
        </div>

        <div className="p-2 flex flex-col">
          <div className="p-2">
            <Divider className="!m-0 !border-ant-border-sec"/>
          </div>

          <Link href="/profile">
            <Button className="!p-2 w-full !justify-start" type="text" icon={<UserOutlined/>}>
              {t('profile')}
            </Button>
          </Link>

          <Button
            className="!p-2 w-full !justify-start" type="text"
            icon={theme === 'dark' ? <SunOutlined/> : <MoonOutlined/>}
            onClick={() => theme === 'dark' ? setTheme('light') : setTheme('dark')}
          >
            {t('toggle_theme')}
          </Button>

          <Link href="/signin" onClick={handleLogout}>
            <Button className="!p-2 w-full !justify-start" type="text" icon={<LogoutOutlined/>}>
              {t('logout')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }, [user, theme, t]);

  if (!mounted || !user) return null;

  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      popupRender={() => dropdownContent}
    >
      <div className="inline-block cursor-pointer">
        <UserAvatar user={user}/>
      </div>
    </Dropdown>
  );
}

export default React.memo(UserAvatarDropdown)