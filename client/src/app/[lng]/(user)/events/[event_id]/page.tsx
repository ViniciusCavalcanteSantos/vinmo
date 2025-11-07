'use client'

import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {fetchEvent, fetchEventImages} from "@/lib/database/Event";
import Event from "@/types/Event";
import {useNotification} from "@/contexts/NotificationContext";
import {useT} from "@/i18n/client";
import Fallback from "@/components/Fallback";
import ImageType from "@/types/Image";
import {ApiStatus} from "@/types/ApiResponse";
import {filesize} from "filesize";
import {Image} from "antd";
import dayjs from "dayjs";
import {useUser} from "@/contexts/UserContext";


export default function Page() {
  const {t} = useT()
  const notification = useNotification();
  const router = useRouter();
  const params = useParams();
  const eventId = Number(params.event_id);
  const [event, setEvent] = useState<Event | null>(null);
  const [images, setImages] = useState<ImageType[]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const {defaultDateFormat} = useUser();

  useEffect(() => {
    Promise.all([
      fetchEvent(eventId, true),
      fetchEventImages(eventId)
    ])
      .then(res => {
        const eventRes = res[0]
        const imageRes = res[1]

        if (eventRes.status === ApiStatus.SUCCESS && imageRes.status === ApiStatus.SUCCESS) {
          setEvent(eventRes.event)
          setImages(imageRes.images)
          setLoading(false)
          return;
        }

        notification.warning({message: t('unable_to_load_event')})
        router.push("/events");
      })
      .catch(() => {
        notification.warning({message: t('unable_to_load_event')})
        router.push("/events");
      })

  }, [eventId])

  if (loading) return <Fallback/>

  return (
    <div>
      <div className="mb-4 flex gap-4">

        <h1><strong>{t('contract')}:</strong> {event?.contract?.code} - {event?.contract?.title}</h1>
        <h2><strong>{t('event')}:</strong> {event?.type.name}</h2>
        <h2><strong>{t('total_photos')}:</strong> {event?.totalImages ?? 0}</h2>
        <h2><strong>{t('size')}:</strong> {filesize(event?.totalSize ?? 0)}</h2>

      </div>
      <div
        className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 justify-center content-center items-center">

        {images.map(image => (
            <div key={image.id}>
              <div
                className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm mx-auto">

                <div className="w-full pt-[67%] relative">
                  <div className="absolute top-0 left-0 w-full h-full [&>.ant-image]:w-full [&>.ant-image]:h-full">
                    <Image src={image.url} className="rounded-t-lg object-contain !h-full "/>
                  </div>
                </div>

                <div className="p-5 flex flex-wrap gap-2">

                  <p><strong>{t('size')}:</strong> {filesize(image.sizeOriginal ?? 0)}</p>
                  <p><strong>{t('added_at')}:</strong> {dayjs(image.createdAt).format(defaultDateFormat)}</p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}