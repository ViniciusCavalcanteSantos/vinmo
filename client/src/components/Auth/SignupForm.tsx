"use client"

import Title from "@/components/Title";
import {Form, Input} from "antd";
import {MailOutlined} from "@ant-design/icons";
import {PrimaryButton} from "@/components/PrimaryButton";
import Link from "next/link";
import {useT} from "@/i18n/client";
import {useNotification} from "@/contexts/NotificationContext";
import {useLocalStorage} from "react-use";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {ApiStatus} from "@/types/ApiResponse";
import SocialMediaAuth from "@/components/Auth/SocialMediaAuth";
import {sendCode} from "@/lib/api/users/sendCode";

export default function SignupForm() {
  const {t} = useT()
  const notification = useNotification();
  const [_, setEmailConfirmation] = useLocalStorage<string | null>('emailConfirmation', null)
  const [sending, setSending] = useState(false)
  const router = useRouter();

  const handleFinish = async (values: any) => {
    setSending(true)
    const res = await sendCode(values.email)
    if (res.status !== ApiStatus.SUCCESS) {
      setSending(false)
      notification.info({
        title: res.message,
      });
      return;
    }

    setEmailConfirmation(values.email)
    notification.success({
      title: t('login.email_code_sent'),
      description: t('login.check_your_inbox')
    });
    router.push('/signup/confirm-code')
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
      <h1 className="text-center mb-4 font-semibold text-ant-text-sec text-base">{t('login.register_to_continue')}</h1>

      <Form.Item
        layout="vertical"
        label="Email"
        name="email"
        rules={[{required: true, max: 255}]}
        style={{marginBottom: 12}}
      >
        <Input prefix={<MailOutlined style={{marginRight: 8}}/>} placeholder="Email" style={{padding: "10px 16px"}}
               type="email"/>
      </Form.Item>

      <Form.Item>
        <PrimaryButton block type="primary" htmlType="submit" loading={sending}>
          {t('login.register')}
        </PrimaryButton>
      </Form.Item>

      <SocialMediaAuth/>

      <div className="flex justify-center">
        <Link href="/signin">
          <span className="underline underline-offset-2">{t('login.already_have_a_account')}</span>
        </Link>
      </div>
    </Form>
  )
}