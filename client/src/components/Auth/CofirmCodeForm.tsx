"use client"

import Logo from "@/components/Logo";
import {Form, Input} from "antd";
import {PrimaryButton} from "@/components/PrimaryButton";
import {useT} from "@/i18n/client";
import {useNotification} from "@/contexts/NotificationContext";
import {useLocalStorage} from "react-use";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {confirm_code, send_code} from "@/lib/database/User";
import {ApiStatus} from "@/types/ApiResponse";

export default function ConfirmCodeForm() {
  const {t} = useT()
  const notification = useNotification();
  const [emailConfirmation] = useLocalStorage<string | null>('emailConfirmation', null)
  const [sending, setSending] = useState(false)
  const router = useRouter();

  useEffect(() => {
    if (!emailConfirmation) router.push("/signup")
  }, [emailConfirmation])

  const sendCode = async () => {
    const res = await send_code(emailConfirmation ?? "")
    if (res.status !== ApiStatus.SUCCESS) {
      notification.info({
        message: res.message,
      });
      return;
    }

    notification.success({
      message: t('login.new_email_code_sent'),
      description: t('login.check_your_inbox')
    });
  }

  const handleFinish = async (values: any) => {
    setSending(true)
    const res = await confirm_code(emailConfirmation ?? "", values.code)
    if (res.status === ApiStatus.MAX_ATTEMPTS) {
      notification.warning({
        message: res.message,
      });
      router.push('/signup')
      return;
    }

    if (res.status !== ApiStatus.SUCCESS) {
      setSending(false)
      notification.info({
        message: res.message,
      });
      return;
    }

    notification.success({
      message: t('login.email_verified_successfully'),
      description: t('login.you_can_proceed_with_registration')
    });
    router.push('/signup/address')
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
      <div className="flex items-center justify-center text-4xl text-ant-text mb-6">
        <Logo width={40}/>
        <h1 className="-translate-x-1"><span className="sr-only">V</span>inmo</h1>
      </div>
      <h1 className="text-center mb-4 font-semibold text-ant-text-sec text-2xl">{t('login.we_emailed_you')}</h1>
      <p className="text-ant-text-sec text-sm mb-2">{t('login.to_complete_account_setup')}</p>
      <p className="text-ant-text-sec font-bold text-base mb-2">{emailConfirmation}</p>

      <Form.Item
        layout="vertical"
        label={t('login.code')}
        name="code"
        rules={[{required: true, max: 255}]}
        style={{marginBottom: 20}}
      >
        <Input.OTP length={8} disabled={sending} onChange={(value) => handleFinish({code: value})}/>
      </Form.Item>

      <Form.Item>
        <PrimaryButton block type="primary" htmlType="submit" loading={sending}>
          {t('login.verify')}
        </PrimaryButton>
      </Form.Item>

      <div className="flex justify-center">
        <button className='font-medium text-ant-primary hover:text-ant-primary-hover cursor-pointer' onClick={sendCode}
                type="button">
          <span className="underline underline-offset-2">{t('login.didnt_receive_an_email')}</span>
        </button>
      </div>
    </Form>
  )
}