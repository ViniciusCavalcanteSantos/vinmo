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
import IconGoogle from "@/components/Icons/IconGoogle";
import IconMicrosoft from "@/components/Icons/IconMicrosoft";
import IconLinkedin from "@/components/Icons/IconLinkedin";

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
            <IconGoogle/>

            <span className='text-ant-text-sec font-semibold text-base'>Google</span>
          </button>
        </li>

        <li>
          <button
            type='button'
            onClick={() => handleSocialogin('microsoft')}
            className="flex items-center justify-center w-full px-4 py-2 space-x-2 transition-colors border border-ant-border rounded-md hover:bg-ant-fill-ter focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ant-border-sec cursor-pointer"
          >
            <IconMicrosoft/>

            <span className='text-ant-text-sec font-semibold text-base'>Microsoft</span>
          </button>
        </li>

        <li>
          <button
            type='button'
            onClick={() => handleSocialogin('linkedin')}
            className="flex items-center justify-center w-full px-4 py-2 space-x-2 transition-colors border border-ant-border rounded-md hover:bg-ant-fill-ter focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ant-border-sec cursor-pointer"
          >
            <IconLinkedin/>

            <span className='text-ant-text-sec font-semibold text-base'>Linkedin</span>
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
