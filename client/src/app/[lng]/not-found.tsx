'use client'

import {PrimaryButton} from "@/components/PrimaryButton";
import {useT} from "@/i18n/client";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

export default function NotFound() {
  const {t} = useT()
  const router = useRouter()

  const [isInternalReferrer, setIsInternalReferrer] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && document.referrer) {
      const currentOrigin = window.location.origin;
      setIsInternalReferrer(document.referrer.includes(currentOrigin));
    }
  }, []);

  const handleNavigation = () => {
    if (isInternalReferrer) {
      router.back();
    } else {
      router.push('/app');
    }
  };

  return (
    <main className='w-full h-full flex flex-col justify-center items-center px-4'>
      <div className='max-w-lg text-center'>
        <h1 className='text-9xl font-light text-ant-text mb-8'>404</h1>
        <h2 className='text-2xl text-ant-text mb-5'>{t('not_found_page.title')}</h2>
        <p className='text-base text-ant-text-sec mb-10'>
          {t('not_found_page.description')}
        </p>

        <PrimaryButton block type="primary" className='max-w-sm' onClick={handleNavigation}>
          {t('not_found_page.back_button')}
        </PrimaryButton>
      </div>
    </main>
  )
}