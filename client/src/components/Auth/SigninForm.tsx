"use client";

import Title from "@/components/Title";
import {Checkbox, Divider, Form, Input} from "antd";
import {LockOutlined, MailOutlined} from "@ant-design/icons";
import {PrimaryButton} from "@/components/PrimaryButton";
import Link from "next/link";
import {useT} from "@/i18n/client";
import {useNotification} from "@/contexts/NotificationContext";
import {useRouter} from "next/navigation";
import {login, socialRedirect} from "@/lib/database/User";
import {ApiStatus} from "@/types/ApiResponse";

export default function SigninForm() {
  const {t} = useT();
  const notification = useNotification();
  const router = useRouter();

  const handleFinish = async (values: any) => {
    const res = await login(values.email, values.password, values.remember_me);
    if (res.status !== ApiStatus.SUCCESS) {
      notification.info({message: res.message});
      return;
    }
    router.push("/home");
  };

  const handleSocialogin = async (socialMedia: string) => {
    const res = await socialRedirect(socialMedia)
    if (res.status !== ApiStatus.SUCCESS) {
      notification.info({message: res.message});
      return;
    }

    window.location.href = res.url
  };

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

      <h1 className="text-center mb-4 font-semibold text-ant-text-sec text-base">
        {t("login.sign_in_to_continue")}
      </h1>

      {/* email */}
      <Form.Item
        layout="vertical"
        label="Email"
        name="email"
        rules={[{required: true, max: 255}]}
      >
        <Input prefix={<MailOutlined style={{marginRight: 8}}/>} placeholder="Email" style={{padding: "10px 16px"}}
               type="email"/>
      </Form.Item>
      <Form.Item
        layout="vertical"
        label={t('login.password')}
        name="password"
        rules={[{required: true, min: 6, max: 255}]}
        style={{marginBottom: 10}}
      >
        <Input.Password prefix={<LockOutlined style={{marginRight: 8}}/>} placeholder={t('login.password')}
                        style={{padding: "10px 16px"}}/>
      </Form.Item>

      <Form.Item
        name="remember_me"
        valuePropName="checked"
        initialValue={false}
        style={{marginBottom: 10}}
      >
        <Checkbox className="text-ant-text-sec">
          {t("login.remember_me")}
        </Checkbox>
      </Form.Item>

      <Form.Item>
        <PrimaryButton block type="primary" htmlType="submit">
          {t('login.sign_in')}
        </PrimaryButton>
      </Form.Item>

      <h1>
        <Divider className='!text-sm !font-semibold  !text-ant-text-sec'>Ou prossiga com:</Divider>
      </h1>

      <ul className='mb-6 flex flex-col gap-4 '>
        <li>
          <button
            type='button'
            onClick={() => handleSocialogin('google')}
            className="flex items-center justify-center w-full px-4 py-2 space-x-2 transition-colors border border-ant-border rounded-md hover:bg-ant-fill-ter focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ant-border-sec cursor-pointer"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className='text-ant-text-sec font-semibold text-base'>Google</span>
          </button>
        </li>

        <li>
          <button
            type='button'
            onClick={() => handleSocialogin('microsoft')}
            className="flex items-center justify-center w-full px-4 py-2 space-x-2 transition-colors border border-ant-border rounded-md hover:bg-ant-fill-ter focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ant-border-sec cursor-pointer"
          >
            <svg className="w-6 h-6" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
              <rect x="12" y="1" width="10" height="10" fill="#7FBA00"/>
              <rect x="1" y="12" width="10" height="10" fill="#00A4EF"/>
              <rect x="12" y="12" width="10" height="10" fill="#FFB900"/>
            </svg>

            <span className='text-ant-text-sec font-semibold text-base'>Microsoft</span>
          </button>
        </li>
      </ul>

      {/* links */}
      <div className="flex justify-center text-sm text-ant-text-sec">
        <Link
          href="/forgot-password"
          className="
            underline underline-offset-2
            rounded-sm px-1
            transition-colors
          "
        >
          {t("login.cant_get_in")}
        </Link>

        <span className="px-2 text-ant-text-sec">•</span>

        <Link
          href="/signup"
          className="
            underline underline-offset-2
            rounded-sm px-1
            transition-colors
          "
        >
          {t("login.create_an_account")}
        </Link>
      </div>
    </Form>
  )
}
