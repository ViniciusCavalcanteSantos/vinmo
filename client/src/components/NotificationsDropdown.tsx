'use client'

import {Button, Divider, Dropdown} from "antd";
import React, {useEffect, useMemo, useState} from "react";
import {useT} from "@/i18n/client";
import {fetchNotifications} from "@/lib/api/notifications/fetchNotifications";
import {useUserNotifications} from "@/hooks/useUserNotifications";
import Notification from "@/types/Notification";
import {ApiStatus} from "@/types/ApiResponse";

export default function NotificationsDropdown() {
  const {t} = useT();
  const [notifications, setNotifications] = useState<Notification[]>([])

  console.log(notifications)
  useEffect(() => {
    fetchNotifications()
      .then(res => {
        console.log(res)
        if (res.status === ApiStatus.SUCCESS) setNotifications(res.notifications)
      })
  }, []);

  useUserNotifications((data) => {
    setNotifications(prev => [data, ...prev])
  });

  const dropdownContent = useMemo(() => {
    return (
      <div
        className="min-w-[260px] flex flex-col gap-1 rounded-2xl
                   bg-ant-bg-elevated border border-ant-border-sec
                   text-ant-text shadow-ant-2"
      >
        <div className="flex items-center gap-x-2 p-4 pb-0">
          <div>
            <div className="font-semibold text-ant-text">{t('notifications')}</div>
            {/*<div className="text-sm text-ant-text-secondary">SUBTITULO</div>*/}
          </div>
        </div>

        <div className="p-2 flex flex-col">
          <div className="p-2">
            <Divider className="!m-0 !border-ant-border-sec"/>
          </div>

          <div className="flex flex-col gap-2">
            {notifications.map(notification => {
              return (
                <div className="p-2 hover:bg-ant-fill-ter rounded-lg cursor-pointer" key={notification.id}>
                  <div className="font-semibold text-ant-text">{notification.data.message}</div>
                  <div className="text-sm text-ant-text-secondary">{notification.data.description}</div>
                </div>
              )
            })}

          </div>
          <Divider className="!m-0 !border-ant-border-sec"/>
          <div className="p-2">
            <Button type="link" className="w-full text-center">
              {t('view_all_notifications')}
            </Button>
          </div>


        </div>
      </div>
    );
  }, [t, notifications]);

  return (
    <Dropdown
      trigger={["click"]}
      popupRender={() => dropdownContent}

    >
      <div className="mr-4">
        <button
          className="rounded-md cursor-pointer border border-ant-border bg-ant-bg hover:bg-ant-fill-sec p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className='fill-ant-text-sec  w-5 h-5'>
            <path
              d="M155.8 96C123.9 96 96.9 119.4 92.4 150.9L64.6 345.2C64.2 348.2 64 351.2 64 354.3L64 480C64 515.3 92.7 544 128 544L512 544C547.3 544 576 515.3 576 480L576 354.3C576 351.3 575.8 348.2 575.4 345.2L547.6 150.9C543.1 119.4 516.1 96 484.2 96L155.8 96zM155.8 160L484.3 160L511.7 352L451.8 352C439.7 352 428.6 358.8 423.2 369.7L408.9 398.3C403.5 409.1 392.4 416 380.3 416L259.9 416C247.8 416 236.7 409.2 231.3 398.3L217 369.7C211.6 358.9 200.5 352 188.4 352L128.3 352L155.8 160z"/>
          </svg>

          <span className="sr-only">{t('open_main_menu')}</span>
        </button>
      </div>

    </Dropdown>
  )
}