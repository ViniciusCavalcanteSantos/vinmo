"use client"

import Title from "@/components/Title";
import {Form, Input} from "antd";
import {MailOutlined} from "@ant-design/icons";
import {PrimaryButton} from "@/components/PrimaryButton";
import Link from "next/link";
import {useT} from "@/i18n/client";
import {useNotification} from "@/contexts/NotificationContext";
import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {ApiStatus} from "@/types/ApiResponse";
import {validateRecoveryToken} from "@/lib/api/user/validateRecoveryToken";
import {changePassword} from "@/lib/api/user/changePassword";

export default function ResetPasswordForm() {
  const {t} = useT()
  const notification = useNotification();
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";

  useEffect(() => {
    (async () => {
      const res = await validateRecoveryToken(email, token)
      if (res.status !== ApiStatus.SUCCESS) {
        notification.warning({
          message: res.message,
        });
        router.push('/forgot-password')
      }
    })()
  }, []);

  const handleFinish = async (values: any) => {
    setSending(true)
    const res = await changePassword(email, token, values.password, values.password_confirmation)
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
    router.push('/signin')
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
        label={t('login.new_password')}
        name="password"
        rules={[{required: true, min: 6, max: 255}]}
        style={{marginBottom: 12}}
      >
        <Input.Password prefix={<MailOutlined style={{marginRight: 8}}/>} placeholder={t('login.new_password')}
                        style={{padding: "10px 16px"}}/>
      </Form.Item>

      <Form.Item
        layout="vertical"
        label={t('login.confirm_new_password')}
        name="password_confirmation"
        rules={[{required: true, min: 6, max: 255}]}
        style={{marginBottom: 12}}
      >
        <Input.Password prefix={<MailOutlined style={{marginRight: 8}}/>} placeholder={t('login.confirm_password')}
                        style={{padding: "10px 16px"}}/>
      </Form.Item>

      <Form.Item>
        <PrimaryButton block type="primary" htmlType="submit" loading={sending}>
          {t('login.change_password')}
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