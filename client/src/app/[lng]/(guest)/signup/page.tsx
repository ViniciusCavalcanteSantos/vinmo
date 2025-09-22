"use client"

import {Form, Input} from "antd";
import {MailOutlined} from "@ant-design/icons";
import Link from "next/link";
import {send_code} from "@/lib/database/User";
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
  const [_, setEmailConfirmation] = useLocalStorage<string|null>('emailConfirmation', null)
  const [sending, setSending] = useState(false)
  const router = useRouter();

  useEffect(() => {
    if(token) router.push("/home")
  }, [token])
  
  const handleFinish = async(values: any) => {
    setSending(true)
    const res = await send_code(values.email)
    if(res.status !== ApiStatus.SUCCESS) {
      setSending(false)
      notification.info({
        message: res.message,
      });
      return;
    }

    setEmailConfirmation(values.email)
    notification.success({
      message: t('login.email_code_sent'),
      description: t('login.check_your_inbox')
    });
    router.push('/signup/confirm-code')
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
      <h1 className="text-center mb-4 font-semibold text-lead-dark text-base">{t('login.register_to_continue')}</h1>

      <Form.Item
        layout="vertical"
        label="Email"
        name="email"
        rules={[{ required: true, max: 255 }]}
        style={{marginBottom: 12}}
      >
        <Input prefix={<MailOutlined style={{ marginRight: 8 }} />} placeholder="Email" style={{ padding: "10px 16px" }} type="email" />
      </Form.Item>

      <Form.Item>
        <PrimaryButton block type="primary" htmlType="submit" loading={sending}>
          {t('login.register')}
        </PrimaryButton>
      </Form.Item>

      <div className="flex justify-center">
        <Link href="/">
          <span className="underline underline-offset-2">{t('login.already_have_a_account')}</span>
        </Link>
      </div>
    </Form>
  );
}
