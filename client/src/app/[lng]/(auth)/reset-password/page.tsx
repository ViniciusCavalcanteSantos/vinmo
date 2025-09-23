"use client"

import {Form, Input} from "antd";
import {MailOutlined} from "@ant-design/icons";
import Link from "next/link";
import {change_password, send_recovery_link, validate_recovery_token} from "@/lib/database/User";
import {useLocalStorage} from "react-use";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import Logo from "@/components/Logo";
import {PrimaryButton} from "@/components/PrimaryButton";
import {useNotification} from "@/contexts/NotificationContext";
import {useT} from "@/i18n/client";
import {ApiStatus} from "@/types/ApiResponse"

export default function Page() {
  const { t } = useT()
  const notification = useNotification();
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";

  useEffect(() => {
    (async() => {
      const res = await validate_recovery_token(email, token)
      if(res.status !== ApiStatus.SUCCESS) {
        notification.warning({
          message: res.message,
        });
        router.push('/forgot-password')
      }
    })()
  }, []);

  const handleFinish = async(values: any) => {
    setSending(true)
    const res = await change_password(email, token, values.password, values.password_confirmation)
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
    router.push('/')
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
      <h1 className="text-center mb-4 font-semibold text-lead-dark text-base">{t('login.cant_log_in')}</h1>

      <Form.Item
        layout="vertical"
        label={t('login.new_password')}
        name="password"
        rules={[{ required: true, min: 6, max: 255 }]}
        style={{marginBottom: 12}}
      >
        <Input.Password prefix={<MailOutlined style={{ marginRight: 8 }} />} placeholder={t('login.new_password')} style={{ padding: "10px 16px" }} />
      </Form.Item>

      <Form.Item
        layout="vertical"
        label={t('login.confirm_new_password')}
        name="password_confirmation"
        rules={[{ required: true, min: 6, max: 255 }]}
        style={{marginBottom: 12}}
      >
        <Input.Password prefix={<MailOutlined style={{ marginRight: 8 }} />} placeholder={t('login.confirm_password')} style={{ padding: "10px 16px" }} />
      </Form.Item>

      <Form.Item>
        <PrimaryButton block type="primary" htmlType="submit" loading={sending}>
          {t('login.change_password')}
        </PrimaryButton>
      </Form.Item>

      <div className="flex justify-center">
        <Link href="/">
          <span className="underline underline-offset-2">{t('login.return_to_log_in')}</span>
        </Link>
      </div>
    </Form>
  );
}
