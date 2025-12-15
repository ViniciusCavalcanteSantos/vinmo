"use client"

import Title from "@/components/Title";
import {Form, Input} from "antd";
import {PrimaryButton} from "@/components/PrimaryButton";
import {useT} from "@/i18n/client";
import {useNotification} from "@/contexts/NotificationContext";
import {useLocalStorage} from "react-use";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {ApiStatus} from "@/types/ApiResponse";
import {confirmCode} from "@/lib/api/users/confirmCode";
import {sendCode} from "@/lib/api/users/sendCode";
import {ApiError} from "@/lib/ApiError";

export default function ConfirmCodeForm() {
  const {t} = useT()
  const notification = useNotification();
  const [emailConfirmation] = useLocalStorage<string | null>('emailConfirmation', null)
  const [sending, setSending] = useState(false)
  const router = useRouter();

  useEffect(() => {
    if (!emailConfirmation) router.push("/signup")
  }, [emailConfirmation])

  const handleSendCode = async () => {
    await sendCode(emailConfirmation ?? "")
      .then(() => {
        notification.success({
          title: t('login.new_email_code_sent'),
          description: t('login.check_your_inbox')
        });
      })
      .catch(err => {
        notification.info({
          title: err.message,
        });
      })
  }

  const handleFinish = async (values: any) => {
    setSending(true)
    await confirmCode(emailConfirmation ?? "", values.code)
      .then(() => {
        notification.success({
          title: t('login.email_verified_successfully'),
          description: t('login.you_can_proceed_with_registration')
        });
        router.push('/signup/finish')
      })
      .catch(err => {
        if (err instanceof ApiError && err.status === ApiStatus.MAX_ATTEMPTS) {
          notification.warning({
            title: err.message,
          });
          router.push('/signup')
          return;
        }

        notification.info({
          title: err.message,
        });
      })
      .finally(() => {
        setSending(false)
      })
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
        <Input.OTP
          length={6}
          formatter={(str) => str.trim().toUpperCase()}
          disabled={sending}
          size='large'
          onChange={(value) => handleFinish({code: value})}
        />
      </Form.Item>

      <Form.Item>
        <PrimaryButton block type="primary" htmlType="submit" loading={sending}>
          {t('login.verify')}
        </PrimaryButton>
      </Form.Item>

      <div className="flex justify-center">
        <button className='font-medium text-ant-primary hover:text-ant-primary-hover cursor-pointer'
                onClick={handleSendCode}
                type="button">
          <span className="underline underline-offset-2">{t('login.didnt_receive_an_email')}</span>
        </button>
      </div>
    </Form>
  )
}