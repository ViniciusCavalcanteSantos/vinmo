"use client"

import {Form, Input, notification} from "antd";
import {LockOutlined, MailOutlined} from "@ant-design/icons";
import Link from "next/link";
import {login} from "@/lib/database/User";
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
    const res = await login(values.email, values.password)
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
      <div className="flex items-center justify-center text-4xl text-lead-dark mb-6 text-dark">
        <Logo width={40} />
        <h1 className="-translate-x-1"><span className="sr-only">V</span>inmo</h1>
      </div>
      <h2 className="text-center mb-4  font-semibold text-lead-dark text-base">Entre para continuar</h2>
      
      <Form.Item
        layout="vertical"
        label="Email"
        name="email"
        rules={[{ required: true, max: 255 }]}
      >
        <Input prefix={<MailOutlined style={{ marginRight: 8 }} />} placeholder="Email" style={{ padding: "10px 16px" }} type="email" />
      </Form.Item>
      <Form.Item
        layout="vertical"
        label="Senha"
        name="password"
        rules={[{ required: true, min: 6, max: 255  }]}
        style={{marginBottom: 24}}
      >
        <Input.Password prefix={<LockOutlined style={{ marginRight: 8 }} />} placeholder="Senha" style={{ padding: "10px 16px" }} />
      </Form.Item>

      <Form.Item>
        <PrimaryButton block type="primary" htmlType="submit">
          Entrar
        </PrimaryButton>
      </Form.Item>

      <div className="flex justify-center">
        <Link href="/recuperar-senha">
          <span className="underline underline-offset-2">Não consegue entrar?</span>
        </Link>
        <span className="px-2  text-lead-dark">•</span>
        <Link href="/criar-conta">
          <span className="underline">Criar uma conta</span>
        </Link>
      </div>
    </Form>
  );
}
