"use client";

import Title from "@/components/ui/Title";
import {Checkbox, Form, Input} from "antd";
import {LockOutlined, MailOutlined} from "@ant-design/icons";
import {PrimaryButton} from "@/components/ui/PrimaryButton";
import Link from "next/link";
import {useT} from "@/i18n/client";
import {useNotification} from "@/contexts/NotificationContext";
import {useRouter} from "next/navigation";
import SocialMediaAuth from "@/components/features/auth/SocialMediaAuth";
import {login} from "@/lib/api/users/login";
import {useUser} from "@/contexts/UserContext";
import {Trans} from "react-i18next";

export default function SigninForm() {
  const {t} = useT();
  const notification = useNotification();
  const router = useRouter();
  const {setUser} = useUser()

  const handleFinish = async (values: any) => {
    await login(values.email, values.password, values.remember_me)
      .then(res => {
        setUser(res.user)
        router.refresh();
        router.push("/app");
      })
      .catch(err => {
        notification.info({title: err.message});
      })
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

      <SocialMediaAuth/>

      {/* links */}
      <div className="flex justify-center text-sm text-ant-text-sec mb-8">
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

      <p className='text-ant-text-ter text-xs mt-6 text-center px-4'>
        <Trans
          i18nKey="login.login_terms"
          components={{
            // Note que removi o underline forçado (!underline) e o ícone.
            // O link fica sutil, apenas mudando de cor ou sublinhando no hover.
            tos: <Link
              href="/legal/terms-of-service"
              target='_blank'
              className='hover:text-ant-text hover:underline transition-colors'
            />,
            pp: <Link
              href="/legal/privacy-policy"
              target='_blank'
              className='hover:text-ant-text hover:underline transition-colors'
            />
          }}
        />
      </p>
    </Form>
  )
}
