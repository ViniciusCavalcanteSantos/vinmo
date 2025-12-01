"use client"

import Title from "@/components/Title";
import {Form, Input} from "antd";
import {MailOutlined} from "@ant-design/icons";
import {PrimaryButton} from "@/components/PrimaryButton";
import Link from "next/link";
import {useT} from "@/i18n/client";
import {useNotification} from "@/contexts/NotificationContext";
import {useState} from "react";
import {useLocalStorage} from "react-use";
import {useRouter} from "next/navigation";
import {ApiStatus} from "@/types/ApiResponse";
import {sendRecoveryLink} from "@/lib/api/users/sendRecoveryLink";

export default function ForgotPasswordForm() {
  const {t} = useT()
  const notification = useNotification();
  const [sending, setSending] = useState(false)
  const [_, setEmailRecovery] = useLocalStorage("emailRecovery", null)
  const router = useRouter();

  const handleFinish = async (values: any) => {
    setSending(true)
    const res = await sendRecoveryLink(values.email)
    if (res.status !== ApiStatus.SUCCESS) {
      setSending(false)
      notification.info({
        message: res.message,
      });
      return;
    }

    notification.success({
      message: res.message,
    });
    setEmailRecovery(values.email)
    router.push('/recovery-sent')
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

      <Form.Item
        layout="vertical"
        label={t('login.email')}
        name="email"
        rules={[{required: true, max: 255}]}
        style={{marginBottom: 12}}
      >
        <Input prefix={<MailOutlined style={{marginRight: 8}}/>} placeholder={t('login.enter_email')}
               style={{padding: "10px 16px"}} type="email"/>
      </Form.Item>

      <Form.Item>
        <PrimaryButton block type="primary" htmlType="submit" loading={sending}>
          {t('login.send_recovery_link')}
        </PrimaryButton>
      </Form.Item>

      <div className="flex justify-center">
        <Link href="/signin">
          <span className="underline underline-offset-2">{t('login.return_to_log_in')}</span>
        </Link>
      </div>
    </Form>
  )
}