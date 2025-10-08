"use client"

import Logo from "@/components/Logo";
import {Checkbox, Form, Input} from "antd";
import {LockOutlined, MailOutlined} from "@ant-design/icons";
import {PrimaryButton} from "@/components/PrimaryButton";
import Link from "next/link";
import {useT} from "@/i18n/client";
import {useNotification} from "@/contexts/NotificationContext";
import {useLocalStorage} from "react-use";
import {useRouter} from "next/navigation";
import {login} from "@/lib/database/User";
import {ApiStatus} from "@/types/ApiResponse";

export default function SigninForm() {
  const {t} = useT()
  const notification = useNotification();
  const [__, setUser] = useLocalStorage("user")
  const router = useRouter();

  const handleFinish = async (values: any) => {
    const res = await login(values.email, values.password, values.remember_me)
    if (res.status !== ApiStatus.SUCCESS) {
      notification.info({
        message: res.message
      });
      return;
    }

    localStorage.setItem("token", res.token);
    setUser(res.user)
    router.push("/home")
  }

  return (
    <Form
      className="!w-full max-w-100 bg-white !px-10 !py-8 rounded-sm shadow-[0_0_10px_rgba(0,0,0,0.1)]"
      initialValues={{remember: true}}
      onFinish={handleFinish}
      requiredMark={false}
    >
      <div className="flex items-center justify-center text-4xl text-lead-dark mb-6 text-dark">
        <Logo width={40}/>
        <h1 className="-translate-x-1"><span className="sr-only">V</span>inmo</h1>
      </div>
      <h2 className="text-center mb-4  font-semibold text-lead-dark text-base">{t('login.sign_in_to_continue')}</h2>

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
        <Checkbox>{t('login.remember_me')}</Checkbox>
      </Form.Item>

      <Form.Item>
        <PrimaryButton block type="primary" htmlType="submit">
          {t('login.sign_in')}
        </PrimaryButton>
      </Form.Item>

      <div className="flex justify-center">
        <Link href="/forgot-password">
          <span className="underline underline-offset-2">{t('login.cant_get_in')}</span>
        </Link>
        <span className="px-2  text-lead-dark">•</span>
        <Link href="/signup">
          <span className="underline">{t('login.create_an_account')}</span>
        </Link>
      </div>
    </Form>
  )
}