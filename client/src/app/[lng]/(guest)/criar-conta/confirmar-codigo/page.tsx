"use client"

import {Form, Input} from "antd";
import {confirm_code, send_code} from "@/lib/database/User";
import {useLocalStorage} from "react-use";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import Logo from "@/components/Logo";
import {PrimaryButton} from "@/components/PrimaryButton";
import {useNotification} from "@/contexts/NotificationContext";
import {useT} from "@/i18n/client";
import {ApiStatus} from "@/types/ApiResponse";

export default function Page() {
  const { t } = useT()
  const notification = useNotification();
  const [token] = useLocalStorage("token")
  const [emailConfirmation] = useLocalStorage<string|null>('emailConfirmation', null)
  const [sending, setSending] = useState(false)
  const router = useRouter();

  useEffect(() => {
    if(token) router.push("/home")
  }, [token])

  useEffect(() => {
    if(!emailConfirmation) router.push("/criar-conta")
  }, [emailConfirmation])

  const sendCode = async() => {
    const res = await send_code(emailConfirmation ?? "")
    if(res.status !== ApiStatus.SUCCESS) {
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

  const handleFinish = async(values: any) => {
    setSending(true)
    const res = await confirm_code(emailConfirmation ?? "", values.code)
    if(res.status === ApiStatus.MAX_ATTEMPTS) {
      notification.warning({
        message: res.message,
      });
      router.push('/criar-conta')
      return;
    }

    if(res.status !== ApiStatus.SUCCESS) {
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
    console.log('teste')
    router.push('/criar-conta/finalizar')
  }

  return (
    <Form
      initialValues={{ remember: true }}
      style={{ maxWidth: 360 }}
      onFinish={handleFinish}
      requiredMark={false}
    >
      <div className="flex items-center justify-center text-4xl text-lead-dark mb-6">
        <Logo width={40} />
        <h1 className="-translate-x-1"><span className="sr-only">V</span>inmo</h1>
      </div>
      <h1 className="text-center mb-4 font-semibold text-lead-dark text-2xl">{t('login.we_emailed_you')}</h1>
      <p className="text-lead-lighter text-sm mb-2">{t('login.to_complete_account_setup')}</p>
      <p className="text-lead-lighter font-bold text-base mb-2">{emailConfirmation}</p>

      <Form.Item
        layout="vertical"
        label={t('login.code')}
        name="code"
        rules={[{ required: true, max: 255 }]}
        style={{marginBottom: 20}}
      >
        <Input.OTP length={8} disabled={sending} onChange={(value) => handleFinish({code: value})} />
      </Form.Item>

      <Form.Item>
        <PrimaryButton block type="primary" htmlType="submit" loading={sending}>
          {t('login.verify')}
        </PrimaryButton>
      </Form.Item>

      <div className="flex justify-center">
        <button className='font-medium text-blue-600 dark:text-blue-500 cursor-pointer' onClick={sendCode} type="button">
          <span className="underline underline-offset-2">{t('login.didnt_receive_an_email')}</span>
        </button>
      </div>
    </Form>
  );
}
