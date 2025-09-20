"use client"

import {Form, Input, notification} from "antd";
import {LockOutlined, MailOutlined, UserOutlined} from "@ant-design/icons";
import Link from "next/link";
import {confirm_code, register, send_code} from "@/lib/database/User";
import {useLocalStorage} from "react-use";
import {redirect} from "next/navigation";
import {useEffect, useState} from "react";
import Logo from "@/components/Logo";
import {PrimaryButton} from "@/components/PrimaryButton";

export default function Page() {
  const [api, contextHolder] = notification.useNotification();
  const [token] = useLocalStorage("token")
  const [emailConfirmation] = useLocalStorage<string|null>('emailConfirmation', null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if(token) redirect("/home")
  }, [token])

  useEffect(() => {
    if(!emailConfirmation) redirect("/criar-conta")
  }, [emailConfirmation])

  const sendCode = async() => {
    const res = await send_code(emailConfirmation ?? "")
    if("error" in res) {
      api.info({
        message: res.error,
      });
      return;
    }

    api.success({
      message: `O e-mail com o novo código foi enviado`,
      description: 'Verifique a caixa de entrada.'
    });
  }

  const handleFinish = async(values: any) => {
    setSending(true)
    const res = await confirm_code(emailConfirmation ?? "", values.code)
    setSending(false)
    if("error" in res) {
      api.info({
        message: res.error,
      });
      return;
    }

    api.success({
      message: `Email verificado com sucesso!`,
      description: 'Você pode prosseguir com o cadastro'
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
      <h1 className="text-center mb-4 font-semibold text-lead-dark text-2xl">A gente enviou o código por e-mail para você</h1>
      <p className="text-lead-lighter text-sm mb-2">Para concluir a configuração da sua conta, insira o código que a gente enviou para:</p>
      <p className="text-lead-lighter font-bold text-base mb-2">{emailConfirmation}</p>

      <Form.Item
        layout="vertical"
        label="Código"
        name="code"
        rules={[{ required: true, max: 255 }]}
        style={{marginBottom: 20}}
      >
        <Input.OTP length={8} disabled={sending} onChange={(value) => handleFinish({code: value})} />
      </Form.Item>

      <Form.Item>
        <PrimaryButton block type="primary" htmlType="submit" loading={sending}>
          Verificar
        </PrimaryButton>
      </Form.Item>

      <div className="flex justify-center">
        <button className='font-medium text-blue-600 dark:text-blue-500 cursor-pointer' onClick={sendCode} type="button">
          <span className="underline underline-offset-2">Não recebeu um e-mail? Reenviar e-mail</span>
        </button>
      </div>
    </Form>
  );
}
