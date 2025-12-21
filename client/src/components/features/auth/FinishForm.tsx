"use client"

import {Form, Input} from "antd";
import Title from "@/components/ui/Title";
import {CheckCircleFilled, LockOutlined, UserOutlined} from "@ant-design/icons";
import {Trans} from "react-i18next";
import Link from "next/link";
import {ExternalLinkIcon} from "@/components/ui/icons/LinkIcon";
import {PrimaryButton} from "@/components/ui/PrimaryButton";
import {useT} from "@/i18n/client";
import {useNotification} from "@/contexts/NotificationContext";
import {useLocalStorage} from "react-use";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {register} from "@/lib/api/users/register";
import {useUser} from "@/contexts/UserContext";

export default function FinishForm() {
  const {t} = useT();
  const notification = useNotification();
  const [emailConfirmation] = useLocalStorage<string | null>('emailConfirmation', null)
  const [sending, setSending] = useState(false)
  const router = useRouter();
  const {setUser} = useUser()

  useEffect(() => {
    if (!emailConfirmation) {
      router.push("/signup");
      return;
    }
  }, [emailConfirmation]);

  const handleFinish = async (values: any) => {
    setSending(true)
    const res = await register(
      values.name, emailConfirmation ?? "",
      values.password, values.password_confirmation
    )
      .then(res => {
        notification.success({
          title: t('login.account_created'),
          description: t('login.start_using_immediately')
        });

        setUser(res.user)
        router.refresh();
        router.push("/app")
      })
      .catch(err => {
        setSending(false)
        notification.info({
          title: err.message,
        });
        return;
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
      <h1 className="text-center font-semibold text-ant-text-sec text-base">
        {t('login.email_verified')}
        <CheckCircleFilled className="!text-ant-success text-sm ml-1"/>
      </h1>
      <h1
        className="text-center mb-4 font-semibold text-ant-text-sec  text-xs">{t('login.finish_setting_up_your_account')}</h1>

      <div className='mb-2'>
        <label htmlFor="email-verified"
               className='text-xs text-ant-text-sec font-semibold'>{t('login.email_address')}</label>
        <p id="emailVerified" className='text-sm text-ant-text-sec font-bold'>{emailConfirmation}</p>
      </div>

      <Form.Item
        layout="vertical"
        label={t('full_name')}
        name="name"
        rules={[{required: true, max: 255}]}
        style={{marginBottom: 12}}
      >
        <Input prefix={<UserOutlined style={{marginRight: 8}}/>} placeholder={t('enter_full_name')}
               style={{padding: "10px 16px"}}/>
      </Form.Item>

      <Form.Item
        layout="vertical"
        label={t('login.password')}
        name="password"
        rules={[{required: true, min: 6, max: 255}]}
        style={{marginBottom: 12}}
      >
        <Input.Password prefix={<LockOutlined style={{marginRight: 8}}/>} placeholder={t('login.create_password')}
                        style={{padding: "10px 16px"}} type="password"/>
      </Form.Item>

      <Form.Item
        layout="vertical"
        label={t('login.confirm_password')}
        name="password_confirmation"
        rules={[{required: true, min: 6, max: 255}]}
        style={{marginBottom: 12}}
      >
        <Input.Password prefix={<LockOutlined style={{marginRight: 8}}/>} placeholder={t('login.confirm_password')}
                        style={{padding: "10px 16px"}} type="password"/>
      </Form.Item>

      <p className='text-ant-text-sec  text-xs mb-2 px-2'>
        <Trans
          i18nKey="login.signup_terms"
          components={{
            tos: <Link href="/service-terms"
                       className='inline-flex items-center gap-1 !underline hover:!no-underline'></Link>,
            pp: <Link href="/privacy-policy"
                      className='inline-flex items-center gap-1 !underline hover:!no-underline'></Link>,
            icon: <ExternalLinkIcon/>
          }}
        />
      </p>

      <Form.Item>
        <PrimaryButton block type="primary" htmlType="submit" loading={sending}>
          {t('login.finish')}
        </PrimaryButton>
      </Form.Item>
    </Form>
  )
}