import {Divider} from "antd";
import IconGoogle from "@/components/Icons/IconGoogle";
import IconMicrosoft from "@/components/Icons/IconMicrosoft";
import IconLinkedin from "@/components/Icons/IconLinkedin";
import React, {useEffect, useState} from "react";
import {ApiStatus} from "@/types/ApiResponse";
import {useNotification} from "@/contexts/NotificationContext";
import {fetchAvailableProviders} from "@/lib/api/users/fetchAvailableProviders";
import {socialRedirect} from "@/lib/api/users/socialRedirect";

function SocialMediaAuth() {
  const [availableProviders, setAvailableProviders] = useState<string[]>([])
  const notification = useNotification();

  useEffect(() => {
    fetchAvailableProviders()
      .then(res => {
        if (res.status === ApiStatus.SUCCESS) {
          setAvailableProviders(res.providers)
        }
      })
  }, []);

  const handleSocialogin = async (socialMedia: string) => {
    const res = await socialRedirect(socialMedia)
    if (res.status !== ApiStatus.SUCCESS) {
      notification.info({message: res.message});
      return;
    }

    window.location.href = res.url
  };

  return (
    <>
      {availableProviders.length > 0 &&
          <div>
              <h1>
                  <Divider className='!text-sm !font-semibold  !text-ant-text-sec'>Ou prossiga com:</Divider>
              </h1>

              <ul className='mb-6 flex flex-col gap-4 '>
                {availableProviders.includes('google') &&
                    <li>
                        <button
                            type='button'
                            onClick={() => handleSocialogin('google')}
                            className="flex items-center justify-center w-full px-4 py-2 space-x-2 transition-colors border border-ant-border rounded-md hover:bg-ant-fill-ter focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ant-border-sec cursor-pointer"
                        >
                            <IconGoogle/>

                            <span className='text-ant-text-sec font-semibold text-base'>Google</span>
                        </button>
                    </li>
                }

                {availableProviders.includes('microsoft') &&
                    <li>
                        <button
                            type='button'
                            onClick={() => handleSocialogin('microsoft')}
                            className="flex items-center justify-center w-full px-4 py-2 space-x-2 transition-colors border border-ant-border rounded-md hover:bg-ant-fill-ter focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ant-border-sec cursor-pointer"
                        >
                            <IconMicrosoft/>

                            <span className='text-ant-text-sec font-semibold text-base'>Microsoft</span>
                        </button>
                    </li>
                }

                {availableProviders.includes('linkedin') &&
                    <li>
                        <button
                            type='button'
                            onClick={() => handleSocialogin('linkedin')}
                            className="flex items-center justify-center w-full px-4 py-2 space-x-2 transition-colors border border-ant-border rounded-md hover:bg-ant-fill-ter focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ant-border-sec cursor-pointer"
                        >
                            <IconLinkedin/>

                            <span className='text-ant-text-sec font-semibold text-base'>Linkedin</span>
                        </button>
                    </li>
                }
              </ul>
          </div>
      }
    </>
  )
}

export default React.memo(SocialMediaAuth)