'use client'

import {Badge, Button, Divider, Dropdown, Empty, Tooltip} from "antd";
import React, {useEffect, useMemo, useState} from "react";
import {useT} from "@/i18n/client";
import {fetchNotifications} from "@/lib/api/notifications/fetchNotifications";
import {useUserNotifications} from "@/hooks/useUserNotifications";
import Notification from "@/types/Notification";
import {CloseOutlined} from "@ant-design/icons";
import {formatTimeFromNow} from "@/lib/utils/date";
import {readNotification} from "@/lib/api/notifications/readNotification";
import {dismissNotification} from "@/lib/api/notifications/dismissNotification";
import dayjs from "dayjs";

export default function NotificationsDropdown() {
  const {t} = useT();
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)

  // TODO: Implementar useNotifications
  useEffect(() => {
    fetchNotifications()
      .then(res => {
        setNotifications(res.notifications)
        setUnreadCount(res.notifications.filter(notification => !notification.readAt).length)
      })
  }, []);

  useUserNotifications((data) => {
    setNotifications(prev => [data, ...prev])
    setUnreadCount(prev => prev + 1)
  });

  const handleNotificationClick = async (notification: Notification) => {
    readNotification(notification.id)
      .then(res => {
        setNotifications(prev => prev.map(n => {
          if (n.id === notification.id) {
            return {...n, readAt: dayjs().toISOString()}
          } else {
            return n
          }
        }))
        if (!notification.readAt && unreadCount > 0) setUnreadCount(unreadCount - 1)
      })
  }

  const handleDismiss = async (notification: Notification) => {
    dismissNotification(notification.id)
      .then(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id))
        if (!notification.readAt && unreadCount > 0) setUnreadCount(unreadCount - 1)
      })
  }


  const dropdownContent = useMemo(() => {
    return (
      <div
        className="min-w-[260px] max-w-[520px] flex flex-col gap-1 rounded-2xl
                   bg-ant-bg-elevated border border-ant-border-sec
                   text-ant-text shadow-ant-2"
      >
        <div className="flex items-center gap-x-2 p-4 pb-0">
          <div>
            <div className="font-semibold text-ant-text text-xl">{t('notifications')}</div>
          </div>
        </div>

        <div className=" flex flex-col">
          <div className="mt-2">
            <Divider className="!m-0 !border-ant-border-sec"/>
          </div>

          <ul className="flex flex-col gap-2 max-h-[622px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 flex justify-center">
                <Empty description={t('no_notifications')} image={Empty.PRESENTED_IMAGE_SIMPLE}/>
              </div>
            ) : (
              notifications.map(notification => {
                return (
                  <li
                    key={notification.id}
                    className='hover:bg-ant-fill-ter flex items-center pl-5 pr-2 py-3 gap-2'
                  >

                    <button
                      onClick={() => handleNotificationClick(notification)}
                      className=" text-start w-full cursor-pointer"
                    >
                      <div>
                        <div className="font-semibold text-ant-text relative">
                          {!notification.readAt && (
                            <div className="absolute -left-3.5 top-2 w-1.5 h-1.5 rounded-full bg-ant-primary"
                                 role="status">
                              <span className="sr-only">{t('unread_notification')}</span>
                            </div>
                          )}

                          {notification.data.message}
                        </div>
                        <div className="text-sm text-ant-text-sec">{notification.data.description}</div>

                        <span className="text-ant-text-ter text-sm">
                        {formatTimeFromNow(notification.createdAt, t)}
                      </span>
                      </div>
                    </button>

                    <div className='ml-auto'>
                      <Tooltip title={t('dismiss')}>
                        <Button
                          type="text"
                          size="middle"
                          icon={<CloseOutlined/>}
                          className="!p-2"
                          onClick={() => handleDismiss(notification)}
                        />
                      </Tooltip>
                    </div>
                  </li>
                )
              })
            )
            }

          </ul>
          {/*<Divider className="!m-0 !border-ant-border-sec"/>*/}
          {/*<div className="p-2">*/}
          {/*  <Button type="link" className="w-full text-center">*/}
          {/*    {t('view_all_notifications')}*/}
          {/*  </Button>*/}
          {/*</div>*/}
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
        <Tooltip title={t('you_have_unread_notifications', {count: unreadCount})} placement='bottomLeft'>
          <Badge
            count={unreadCount}
            size="small" style={{fontSize: 10, background: "var(--ant-color-primary)"}}
            offset={[-4, 4]}
          >
            <button
              className="rounded-md cursor-pointer border border-ant-border bg-ant-bg hover:bg-ant-fill-sec p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className='fill-ant-text-sec  w-5 h-5'>
                <path
                  d="M155.8 96C123.9 96 96.9 119.4 92.4 150.9L64.6 345.2C64.2 348.2 64 351.2 64 354.3L64 480C64 515.3 92.7 544 128 544L512 544C547.3 544 576 515.3 576 480L576 354.3C576 351.3 575.8 348.2 575.4 345.2L547.6 150.9C543.1 119.4 516.1 96 484.2 96L155.8 96zM155.8 160L484.3 160L511.7 352L451.8 352C439.7 352 428.6 358.8 423.2 369.7L408.9 398.3C403.5 409.1 392.4 416 380.3 416L259.9 416C247.8 416 236.7 409.2 231.3 398.3L217 369.7C211.6 358.9 200.5 352 188.4 352L128.3 352L155.8 160z"/>
              </svg>

              <span className="sr-only">{t('open_main_menu')}</span>
            </button>
          </Badge>
        </Tooltip>
      </div>
    </Dropdown>
  )
}