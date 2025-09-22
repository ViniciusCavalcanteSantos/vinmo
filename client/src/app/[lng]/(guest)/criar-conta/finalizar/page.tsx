"use client"

import {Form, Input} from "antd";
import {CheckCircleFilled, LockOutlined, UserOutlined} from "@ant-design/icons";
import Link from "next/link";
import {register} from "@/lib/database/User";
import {useLocalStorage} from "react-use";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import Logo from "@/components/Logo";
import {PrimaryButton} from "@/components/PrimaryButton";
import {ExternalLinkIcon} from "@/components/Icons/LinkIcon";
import {useNotification} from "@/contexts/NotificationContext";

export default function Page() {
  const notification = useNotification();
  const [token, setToken] = useLocalStorage("token")
  const [_, setUser] = useLocalStorage("user")
  const [emailConfirmation] = useLocalStorage<string|null>('emailConfirmation', null)
  const [sending, setSending] = useState(false)
  const router = useRouter();

  useEffect(() => {
    if(token) router.push("/home")
  }, [token])
  
  const handleFinish = async(values: any) => {
    setSending(true)
    const res = await register(values.name, emailConfirmation ?? "", values.password, values.password_confirmation)
    if("error" in res) {
      setSending(false)
      notification.info({
        message: res.error,
      });
      return;
    }

    notification.success({
      message: `Conta criada com sucesso`,
      description: 'Comece a usar imediatamente!'
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
        Endereço de e-mail verificado
        <CheckCircleFilled className="!text-green-700 text-sm ml-1" />
      </h1>
      <h1 className="text-center mb-4 font-semibold text-lead-dark text-xs">Finish setting up your account</h1>

      <div className='mb-2'>
        <label htmlFor="email-verified" className='text-xs text-lead-light font-semibold'>Endereço de e-mail</label>
        <p id="emailVerified" className='text-sm text-lead-dark font-bold'>{emailConfirmation}</p>
      </div>

      <Form.Item
        layout="vertical"
        label="Nome completo"
        name="name"
        rules={[{ required: true, max: 255 }]}
        style={{marginBottom: 12}}
      >
        <Input prefix={<UserOutlined style={{ marginRight: 8 }} />} placeholder="Digitar o seu nome completo" style={{ padding: "10px 16px" }}/>
      </Form.Item>

      <Form.Item
        layout="vertical"
        label="Senha"
        name="password"
        rules={[{ required: true, min: 6, max: 255 }]}
        style={{marginBottom: 12}}
      >
        <Input.Password prefix={<LockOutlined style={{ marginRight: 8 }} />} placeholder="Criar senha" style={{ padding: "10px 16px" }} type="password" />
      </Form.Item>

      <Form.Item
        layout="vertical"
        label="Confirmar senha"
        name="password_confirmation"
        rules={[{ required: true, min: 6, max: 255 }]}
        style={{marginBottom: 12}}
      >
        <Input.Password prefix={<LockOutlined style={{ marginRight: 8 }} />} placeholder="Confirmar senha" style={{ padding: "10px 16px" }} type="password" />
      </Form.Item>

      <p className='text-lead-light text-xs mb-2 px-2'>
        Ao fazer a inscrição, aceito os
        <Link href="/client/public" className='inline-flex items-center gap-1 mx-1 !underline hover:!no-underline'>Termos de Serviço <ExternalLinkIcon /></Link>
        e concordo com a
        <Link href="/client/public" className='inline-flex items-center gap-1 mx-1 !underline hover:!no-underline'>Política de Privacidade <ExternalLinkIcon /></Link>
        da Vinmo.
      </p>

      <Form.Item>
        <PrimaryButton block type="primary" htmlType="submit" loading={sending}>
          Continuar
        </PrimaryButton>
      </Form.Item>
    </Form>
  );
}
