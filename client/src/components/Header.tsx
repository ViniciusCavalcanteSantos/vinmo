"use client"

import {CSSProperties, useState} from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import {
  AliwangwangOutlined,
  CalendarOutlined,
  CameraOutlined,
  CloseOutlined,
  FileTextOutlined,
  MenuOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {useT} from "@/i18n/client";
import UserAvatarDropdown from "@/components/UserAvatarDropdown";
import {Button, Divider} from "antd";
import {useUser} from "@/contexts/UserContext";

export default function Header() {
  const {user} = useUser();
  const [open, setOpen] = useState(false);
  const {t} = useT()

  const iconClass = "text-ant-text-secondary";
  const iconStyle = {fontSize: 20} as CSSProperties;

  const menu = [
    {title: t('contracts'), link: "/contracts", icon: <FileTextOutlined className={iconClass} style={iconStyle}/>},
    {title: t('events'), link: "/events", icon: <CalendarOutlined className={iconClass} style={iconStyle}/>},
    {title: t('clients'), link: "/clients", icon: <TeamOutlined className={iconClass} style={iconStyle}/>},
    {
      title: t('team_members'),
      link: "/team-members",
      icon: <AliwangwangOutlined className={iconClass} style={iconStyle}/>
    },
    {title: t('photo_sorter'), link: "/photo-sorter", icon: <CameraOutlined className={iconClass} style={iconStyle}/>},
  ];

  return (
    <header className="bg-ant-bg-elevated border-b border-ant-border-sec">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex lg:flex-1 items-center">
          <div className="mr-4">
            <button
              className="rounded-md cursor-pointer border border-ant-border bg-ant-bg hover:bg-ant-fill-sec"
              onClick={() => setOpen(true)}
            >
              <MenuOutlined className="p-2 text-ant-text"/>
              <span className="sr-only">{t('open_main_menu')}</span>
            </button>
          </div>

          <Link href="/home" className="-m-1.5 p-1.5">
            <div className="flex items-center justify-center text-[28px] text-ant-text">
              <Logo width={32}/>
              <div className="-translate-x-1"><span className="sr-only">V</span>inmo</div>
            </div>
          </Link>
        </div>

        <UserAvatarDropdown user={user}/>
      </div>

      <div className={`fixed w-full h-full top-0 right-0 z-[1001] ${open ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute w-full h-full top-0 right-0 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          } bg-ant-bg-mask`}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="global-navigation-id"
          className={`
            transition-transform duration-300 ${open ? '' : '-translate-x-full'} ease-in-out
            h-full w-full max-w-80 fixed left-0 rounded-l-xl
            max-xss:!w-[calc(100%-2rem)]
            bg-ant-bg border-r border-ant-border-secondary shadow-ant-2
          `}
        >
          <h1 id="global-navigation-id" className="sr-only">
            Global navigation {t('global_navigation')}
          </h1>

          <div className="h-full w-full flex flex-col p-2">
            <div className="flex justify-between items-center px-2 pt-2 pb-6">
              <div>
                <span className="sr-only">Vinmo</span>
                <Logo width={32}/>
              </div>

              <Button
                type={'text'}
                className="h-8 w-8 flex items-center justify-center rounded-lg cursor-pointer hover:bg-ant-fill-sec"
                onClick={() => setOpen(false)}
              >
                <span className="sr-only">{t('close_menu')}</span>
                <CloseOutlined/>
              </Button>
            </div>

            <nav>
              <ul className="flex flex-col gap-1">
                {menu.map((item, index) => (
                  <li key={index}>
                    <Link href={item.link} onClick={() => setOpen(false)}>
                      <Button
                        className="w-full flex !justify-start !px-2"
                        type="text"
                        icon={item.icon}
                      >
                        {item.title}
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="px-2">
                <Divider className="!my-4 !border-ant-border-secondary"/>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
