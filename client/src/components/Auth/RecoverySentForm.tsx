"use client"

import Title from "@/components/Title";
import Image from "next/image";
import email from "@/assets/email.png";
import {Trans} from "react-i18next";
import Link from "next/link";
import {Form} from "antd";
import {useT} from "@/i18n/client";
import {useNotification} from "@/contexts/NotificationContext";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useLocalStorage} from "react-use";
import {ApiStatus} from "@/types/ApiResponse";
import {sendRecoveryLink} from "@/lib/api/users/sendRecoveryLink";

export default function RecoverySentForm() {
  const {t} = useT()
  const notification = useNotification();
  const [sending, setSending] = useState(false)
  const router = useRouter();
  const [emailRecovery] = useLocalStorage("emailRecovery", null)

  useEffect(() => {
    if (!emailRecovery) router.push("/forgot-password")
  }, [emailRecovery]);

  const handleFinish = async () => {
    setSending(true)
    const res = await sendRecoveryLink(emailRecovery ?? "")
    if (res.status !== ApiStatus.SUCCESS) {
      setSending(false)
      notification.info({
        title: res.message,
      });
      return;
    }

    notification.success({
      title: res.message,
    });
  }

  return (
    <Form
      className="
        !w-full max-w-100
        bg-ant-bg-elevated
        border border-ant-border-sec
        !px-10 !py-8 rounded-sm
        shadow-[0_0_10px_rgba(0,0,0,0.1)]
      "
      initialValues={{remember: true}}
      onFinish={handleFinish}
      requiredMark={false}
    >

      <div className="flex items-center justify-center text-3xl text-ant-text mb-6">
        <Title/>
      </div>
      <h1 className="text-center mb-4 font-semibold text-ant-text-sec text-base">{t('login.cant_log_in')}</h1>

      <Image src={email} alt={t('login.email_envelope_icon')} width={100} className="mx-auto mb-5"/>

      <div className='mb-2'>
        <p className="text-ant-text-sec text-sm mb-2">{t('login.we_sent_recovery_link')}</p>
        <p id="emailVerified" className='text-sm text-ant-text-sec font-bold'>{emailRecovery}</p>
      </div>

      <p className='text-lead-light text-xs mb-8'>
        <Trans
          i18nKey="login.if_you_havent_rececived_the_email_check_your_spam"
          components={{
            su: <Link href="/signup" className='inline-flex items-center gap-1 '></Link>,
          }}
        />
      </p>

      <div className="flex justify-center">
        <Link href="/forgot-password">
          <span className="underline underline-offset-2">{t('login.return_to_log_in')}</span>
        </Link>
        <span className="px-2 text-ant-text-sec">•</span>
        <button className='font-medium text-blue-600 hover:text-blue-400 cursor-pointer transition-colors duration-300'
                type="submit" disabled={sending}>
          <span className="underline underline-offset-2">{t('login.resend_recovery_link')}</span>
        </button>
      </div>
    </Form>
  )
}