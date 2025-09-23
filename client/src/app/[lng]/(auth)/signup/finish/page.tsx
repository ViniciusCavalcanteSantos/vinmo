"use client"

import {Form, Input} from "antd";
import {CheckCircleFilled, LockOutlined, UserOutlined} from "@ant-design/icons";
import Link from "next/link";
import {register} from "@/lib/database/User";
import {useLocalStorage} from "react-use";
import {useRouter} from "next/navigation";
import {useState} from "react";
import Logo from "@/components/Logo";
import {PrimaryButton} from "@/components/PrimaryButton";
import {ExternalLinkIcon} from "@/components/Icons/LinkIcon";
import {useNotification} from "@/contexts/NotificationContext";
import {useT} from "@/i18n/client";
import {Trans} from "react-i18next";
import {ApiStatus} from "@/types/ApiResponse";

export default function Page() {
  const { t } = useT();
  const notification = useNotification();
  const [_, setToken] = useLocalStorage("token")
  const [__, setUser] = useLocalStorage("user")
  const [emailConfirmation] = useLocalStorage<string|null>('emailConfirmation', null)
  const [sending, setSending] = useState(false)
  const router = useRouter();

  const handleFinish = async(values: any) => {
    setSending(true)
    const res = await register(values.name, emailConfirmation ?? "", values.password, values.password_confirmation)
    if(res.status !== ApiStatus.SUCCESS) {
      setSending(false)
      notification.info({
        message: res.message,
      });
      return;
    }

    notification.success({
      message: t('login.account_created'),
      description: t('login.start_using_immediately')
    });

    setToken(res.token)
    setUser(res.user)
    router.push("/home")
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
      <h1 className="text-center font-semibold text-lead-dark text-base">
        {t('login.email_verified')}
        <CheckCircleFilled className="!text-green-700 text-sm ml-1" />
      </h1>
      <h1 className="text-center mb-4 font-semibold text-lead-dark text-xs">Finish setting up your account</h1>

      <div className='mb-2'>
        <label htmlFor="email-verified" className='text-xs text-lead-light font-semibold'>{t('login.email_address')}</label>
        <p id="emailVerified" className='text-sm text-lead-dark font-bold'>{emailConfirmation}</p>
      </div>

      <Form.Item
        layout="vertical"
        label={t('full_name')}
        name="name"
        rules={[{ required: true, max: 255 }]}
        style={{marginBottom: 12}}
      >
        <Input prefix={<UserOutlined style={{ marginRight: 8 }} />} placeholder={t('enter_full_name')} style={{ padding: "10px 16px" }}/>
      </Form.Item>

      <Form.Item
        layout="vertical"
        label={t('login.password')}
        name="password"
        rules={[{ required: true, min: 6, max: 255 }]}
        style={{marginBottom: 12}}
      >
        <Input.Password prefix={<LockOutlined style={{ marginRight: 8 }} />} placeholder={t('login.create_password')} style={{ padding: "10px 16px" }} type="password" />
      </Form.Item>

      <Form.Item
        layout="vertical"
        label={t('login.confirm_password')}
        name="password_confirmation"
        rules={[{ required: true, min: 6, max: 255 }]}
        style={{marginBottom: 12}}
      >
        <Input.Password prefix={<LockOutlined style={{ marginRight: 8 }} />} placeholder={t('login.confirm_password')} style={{ padding: "10px 16px" }} type="password" />
      </Form.Item>

      <p className='text-lead-light text-xs mb-2 px-2'>
        <Trans
          i18nKey="login.signup_terms"
          components={{
            tos: <Link href="/" className='inline-flex items-center gap-1 !underline hover:!no-underline'></Link>,
            pp: <Link href="/" className='inline-flex items-center gap-1 !underline hover:!no-underline'></Link>,
            icon: <ExternalLinkIcon />
          }}
        />
      </p>

      <Form.Item>
        <PrimaryButton block type="primary" htmlType="submit" loading={sending}>
          {t('login.finish')}
        </PrimaryButton>
      </Form.Item>
    </Form>
  );
}
