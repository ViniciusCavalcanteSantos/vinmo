'use client'

import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {fetchEvent, fetchEventImages} from "@/lib/database/Event";
import Event from "@/types/Event";
import {useNotification} from "@/contexts/NotificationContext";
import {useT} from "@/i18n/client";
import Fallback from "@/components/Fallback";
import Image from "@/types/Image";
import {ApiStatus} from "@/types/ApiResponse";

export default function Page() {
  const {t} = useT()
  const notification = useNotification();
  const router = useRouter();
  const params = useParams();
  const eventId = Number(params.event_id);
  const [event, setEvent] = useState<Event | null>(null);
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      fetchEvent(eventId),
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
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
      {images.map(image => (
          <div>

            {/*<img src={image.url} alt={t('event_image')} key={image.id} width={300} height={300}/>*/}

            <div
              className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm ">
              <a href="#">
                <img className="rounded-t-lg" src={image.url} alt=""/>
              </a>
              <div className="p-5">
                <a href="#">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">Noteworthy
                    technology acquisitions 2021</h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 ">Here are the biggest enterprise
                  technology acquisitions of 2021 so far, in reverse chronological order.</p>
                <a href="#"
                   className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 ">
                  Read more
                  <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                       fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"/>
                  </svg>
                </a>
              </div>
            </div>


          </div>
        )
      )}
    </div>
  )
}