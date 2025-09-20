"use client"

import {Button, Form, Input, notification} from "antd";
import {LockOutlined, MailOutlined, UserOutlined} from "@ant-design/icons";
import Link from "next/link";
import {register} from "@/lib/database/User";
import {useLocalStorage} from "react-use";
import {redirect} from "next/navigation";
import {useEffect} from "react";
import Logo from "@/components/Logo";
import {PrimaryButton} from "@/components/PrimaryButton";

export default function Page() {
  const [api, contextHolder] = notification.useNotification();
  const [token, setToken] = useLocalStorage("token")
  const [_, setUser] = useLocalStorage("user")

  useEffect(() => {
    if(token) redirect("/home")
  }, [token])
  
  const handleFinish = async(values: any) => {
    const res = await register(values.name, values.email, values.password, values.password_confirmation)
    if("error" in res) {
      api.info({
        message: res.error,
      });
      return;
    }

    setToken(res.token)
    setUser(res.user)
    redirect("/home")
  }

  return (
    <Form
      initialValues={{ remember: true }}
      style={{ maxWidth: 360 }}
      onFinish={handleFinish}
      requiredMark={false}
    >
      {contextHolder}
      <div className="flex items-center justify-center text-4xl text-[#172b4d] mb-6">
        <Logo width={40} />
        <h1 className="-translate-x-1"><span className="sr-only">V</span>inmo</h1>
      </div>
      <h1 className="text-center mb-4  font-semibold text-[#172b4d] text-base">Registre-se para continuar</h1>

      <Form.Item
        layout="vertical"
        label="Nome"
        name="name"
        rules={[{ required: true, max: 255 }]}
        style={{marginBottom: 12}}
      >
        <Input prefix={<UserOutlined style={{ marginRight: 8 }} />} placeholder="Nome" style={{ padding: "10px 16px" }} />
      </Form.Item>
      <Form.Item
        layout="vertical"
        label="Email"
        name="email"
        rules={[{ required: true, max: 255 }]}
        style={{marginBottom: 12}}
      >
        <Input prefix={<MailOutlined style={{ marginRight: 8 }} />} placeholder="Email" style={{ padding: "10px 16px" }} type="email" />
      </Form.Item>
      <Form.Item
        layout="vertical"
        label="Senha"
        name="password"
        rules={[{ required: true, max: 255  }]}
        style={{marginBottom: 12}}
      >
        <Input.Password prefix={<LockOutlined style={{ marginRight: 8 }} />} placeholder="Senha" style={{ padding: "10px 16px" }} />
      </Form.Item>
      <Form.Item
        layout="vertical"
        label="Confirmar senha"
        name="password_confirmation"
        rules={[{ required: true, max: 255  }]}
        style={{marginBottom: 40}}
      >
        <Input.Password prefix={<LockOutlined style={{ marginRight: 8 }} />} placeholder="Confirmar senha" style={{ padding: "10px 16px" }} />
      </Form.Item>

      <Form.Item>
        <PrimaryButton block type="primary" htmlType="submit">
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
