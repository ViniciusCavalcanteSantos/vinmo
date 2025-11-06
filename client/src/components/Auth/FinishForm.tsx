"use client"

import {Form, Input} from "antd";
import Logo from "@/components/Logo";
import {CheckCircleFilled, LockOutlined, UserOutlined} from "@ant-design/icons";
import {Trans} from "react-i18next";
import Link from "next/link";
import {ExternalLinkIcon} from "@/components/Icons/LinkIcon";
import {PrimaryButton} from "@/components/PrimaryButton";
import {useT} from "@/i18n/client";
import {useNotification} from "@/contexts/NotificationContext";
import {useLocalStorage} from "react-use";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {register} from "@/lib/database/User";
import {ApiStatus} from "@/types/ApiResponse";
import {FullAddressType} from "@/types/Address";

export default function FinishForm() {
  const {t} = useT();
  const notification = useNotification();
  const [emailConfirmation] = useLocalStorage<string | null>('emailConfirmation', null)
  const [address, setAddress] = useLocalStorage<FullAddressType | null>("address")
  const [sending, setSending] = useState(false)
  const router = useRouter();

  useEffect(() => {
    if (!emailConfirmation) {
      setAddress(null)
      router.push("/signup");
      return;
    }

    if (!address) {
      notification.warning({message: t('login.we_need_your_address')})
      router.push("/signup/address");
    }
  }, [emailConfirmation, address]);

  const handleFinish = async (values: any) => {
    if (!address) return;

    setSending(true)
    const res = await register(
      values.name, emailConfirmation ?? "",
      values.password, values.password_confirmation,
      address
    )
    if (res.status !== ApiStatus.SUCCESS) {
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

    router.push("/home")
  }

  return (
    <Form
      className="!w-full max-w-100 bg-white !px-10 !py-8 rounded-sm shadow-[0_0_10px_rgba(0,0,0,0.1)]"
      initialValues={{remember: true}}
      onFinish={handleFinish}
      requiredMark={false}
    >
      <div className="flex items-center justify-center text-4xl text-lead-dark mb-6">
        <Logo width={40}/>
        <h1 className="-translate-x-1"><span className="sr-only">V</span>inmo</h1>
      </div>
      <h1 className="text-center font-semibold text-lead-dark text-base">
        {t('login.email_verified')}
        <CheckCircleFilled className="!text-green-700 text-sm ml-1"/>
      </h1>
      <h1
        className="text-center mb-4 font-semibold text-lead-dark text-xs">{t('login.finish_setting_up_your_account')}</h1>

      <div className='mb-2'>
        <label htmlFor="email-verified"
               className='text-xs text-lead-light font-semibold'>{t('login.email_address')}</label>
        <p id="emailVerified" className='text-sm text-lead-dark font-bold'>{emailConfirmation}</p>
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

      <p className='text-lead-light text-xs mb-2 px-2'>
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