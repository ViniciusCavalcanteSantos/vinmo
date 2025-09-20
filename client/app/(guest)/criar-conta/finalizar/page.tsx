"use client"

import {Form, Input, notification} from "antd";
import {LockOutlined, MailOutlined, UserOutlined} from "@ant-design/icons";
import Link from "next/link";
import {register, send_code} from "@/lib/database/User";
import {useLocalStorage} from "react-use";
import {redirect} from "next/navigation";
import {useEffect, useState} from "react";
import Logo from "@/components/Logo";
import {PrimaryButton} from "@/components/PrimaryButton";

export default function Page() {
  const [api, contextHolder] = notification.useNotification();
  const [token] = useLocalStorage("token")
  const [_, setEmailConfirmation] = useLocalStorage<string|null>('emailConfirmation', null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if(token) redirect("/home")
  }, [token])
  
  const handleFinish = async(values: any) => {
    setSending(true)
    const res = await send_code(values.email)
    setSending(false)
    if("error" in res) {
      api.info({
        message: res.error,
      });
      return;
    }

    setEmailConfirmation(values.email)
    api.success({
      message: `O e-mail com o código foi enviado`,
      description: 'Verifique a caixa de entrada.'
    });
    redirect('/criar-conta/finalizar')
  }

  return (
    <Form
      initialValues={{ remember: true }}
      style={{ maxWidth: 360 }}
      onFinish={handleFinish}
      requiredMark={false}
    >
      {contextHolder}
      <div className="flex items-center justify-center text-4xl text-lead-dark mb-6">
        <Logo width={40} />
        <h1 className="-translate-x-1"><span className="sr-only">V</span>inmo</h1>
      </div>
      <h1 className="text-center mb-4 font-semibold text-lead-dark text-base">Registre-se para continuar</h1>

      <Form.Item
        layout="vertical"
        label="Email"
        name="email"
        rules={[{ required: true, max: 255 }]}
        style={{marginBottom: 12}}
      >
        <Input prefix={<MailOutlined style={{ marginRight: 8 }} />} placeholder="Email" style={{ padding: "10px 16px" }} type="email" />
      </Form.Item>

      <Form.Item>
        <PrimaryButton block type="primary" htmlType="submit" loading={sending}>
          Registre-se
        </PrimaryButton>
      </Form.Item>

      <div className="flex justify-center">
        <Link href="/">
          <span className="underline underline-offset-2">Já tem uma conta Vinmo? Entrar</span>
        </Link>
      </div>
    </Form>
  );
}
