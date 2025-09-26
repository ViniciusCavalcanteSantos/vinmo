"use client"

import {CSSProperties, useState} from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import {
  AliwangwangOutlined,
  CalendarOutlined, CameraOutlined,
  CloseOutlined,
  FileTextOutlined,
  MenuOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {useT} from "@/i18n/client";
import useUser from "@/hooks/useUser";
import UserAvatarDropdown from "@/components/UserAvatarDropdown";
import {Button, Divider} from "antd";
import theme from "@/theme";

export default function Header() {
  const user = useUser();
  const [open, setOpen] = useState(false);
  const {t} = useT()

  // user.picture = "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
  const iconsStyle = { fontSize: 20, color: theme.neutralEmphasis} as CSSProperties
  const menu = [
    {title: t('contracts'), link: "/contracts", icon: <FileTextOutlined style={iconsStyle} />},
    {title: t('events'), link: "/contracts", icon: <CalendarOutlined style={iconsStyle} />},
    {title: t('clients'), link: "/clients", icon: <TeamOutlined style={iconsStyle} />},
    {title: t('team_members'), link: "/team-members", icon: <AliwangwangOutlined style={iconsStyle} />},
    {title: t('photo_sorter'), link: "/photo-sorter", icon: <CameraOutlined style={iconsStyle} />}
  ]

  return (
    <header className="bg-foreground border-b-1 border-dark-muted">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex lg:flex-1 items-center">
          <div className="mr-4">
            <button
              className="rounded-md bg-white border-1 border-border cursor-pointer hover:bg-neutral-muted"
              onClick={() => setOpen(true)}
            >
              <MenuOutlined className="p-2 !text-neutral-emphasis" />
              <span className="sr-only">{t('open_main_menu')}</span>
            </button>
          </div>

          <Link href="/home" className="-m-1.5 p-1.5">
            <div className="flex items-center justify-center text-[28px] text-lead-dark">
              <Logo width={32}/>
              <h1 className="-translate-x-1"><span className="sr-only">V</span>inmo</h1>
            </div>
          </Link>
        </div>

        <UserAvatarDropdown user={user}/>
      </div>

      <div
        className={`
          fixed w-full h-full top-0 right-0
          ${open ? "" : "pointer-events-none"}
        `}
      >
        <div
          onClick={() => setOpen(false)}
          className={`
          absolute w-full h-full top-0 right-0 
          bg-overlay transition-opacity duration-300 
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}></div>

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="global-navigation-id"
          className={`
            transition-transform duration-300 ${open ? '' : '-translate-x-full'} ease-in-out
            h-full w-full max-w-80 bg-white fixed left-0 rounded-l-xl shadow-[0_0_0_1px_rgba(209,217,224,0.5),0_-6px_12px_-3px_rgba(37,41,46,0.04),0_-6px_18px_0_rgba(37,41,46,0.12)]
            max-xss:!w-[calc(100%-2rem)]
          `}>
          <h1 id="global-navigation-id" className="sr-only">Global navigation{t('global_navigation')}</h1>
          <div className="h-full w-full flex flex-col p-2">
            <div className="flex justify-between items-center px-2 pt-2 pb-6">
              <div className="">
                <span className="sr-only">Vinmo</span>
                <Logo width={32}/>
              </div>

              <button
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted-dark hover:[&>span]:!text-dark cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <span className="sr-only">{t('close_menu')}</span>
                <CloseOutlined className="!text-neutral-emphasis text-sm" />
              </button>
            </div>
            
            <nav className="">
              <ul className="flex flex-col gap-1">
                {menu.map((item, index) => (
                  <li key={index}>
                    <Link href={item.link}>
                      <Button
                        className="w-full flex !justify-start !text-dark !px-2"
                        type="text"
                        icon={item.icon}
                      >
                        {item.title}
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="">
                <Divider className="!my-4 !border-border-muted" />
              </div>

              <div className="px-2">
                {/*<h2 className="text-neutral-emphasis text-xs font-bold">Events</h2>*/}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

