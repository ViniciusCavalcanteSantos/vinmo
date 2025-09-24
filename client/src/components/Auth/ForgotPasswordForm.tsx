"use client"

import Logo from "@/components/Logo";
import {Form, Input} from "antd";
import {MailOutlined} from "@ant-design/icons";
import {PrimaryButton} from "@/components/PrimaryButton";
import Link from "next/link";
import {useT} from "@/i18n/client";
import {useNotification} from "@/contexts/NotificationContext";
import {useState} from "react";
import {useLocalStorage} from "react-use";
import {useRouter} from "next/navigation";
import {send_recovery_link} from "@/lib/database/User";
import {ApiStatus} from "@/types/ApiResponse";

export default function ForgotPasswordForm() {
  const { t } = useT()
  const notification = useNotification();
  const [sending, setSending] = useState(false)
  const [_, setEmailRecovery] = useLocalStorage("emailRecovery", null)
  const router = useRouter();

  const handleFinish = async(values: any) => {
    setSending(true)
    const res = await send_recovery_link(values.email)
    if(res.status !== ApiStatus.SUCCESS) {
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

  return(
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
      <h1 className="text-center mb-4 font-semibold text-lead-dark text-base">{t('login.cant_log_in')}</h1>

      <Form.Item
        layout="vertical"
        label={t('login.email')}
        name="email"
        rules={[{ required: true, max: 255 }]}
        style={{marginBottom: 12}}
      >
        <Input prefix={<MailOutlined style={{ marginRight: 8 }} />} placeholder={t('login.enter_email')} style={{ padding: "10px 16px" }} type="email" />
      </Form.Item>

      <Form.Item>
        <PrimaryButton block type="primary" htmlType="submit" loading={sending}>
          {t('login.send_recovery_link')}
        </PrimaryButton>
      </Form.Item>

      <div className="flex justify-center">
        <Link href="/client/public">
          <span className="underline underline-offset-2">{t('login.return_to_log_in')}</span>
        </Link>
      </div>
    </Form>
  )
}