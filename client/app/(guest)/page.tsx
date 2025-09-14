"use client"

import {Button, Form, Input, notification} from "antd";
import {LockOutlined, MailOutlined} from "@ant-design/icons";
import Link from "next/link";
import {login} from "@/app/lib/database/User";
import {useLocalStorage} from "react-use";
import {redirect} from "next/navigation";
import {useEffect} from "react";

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
      <h1 className="text-center mb-8 text-2xl font-semibold">Entrar</h1>
      
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
      >
        <Input.Password prefix={<LockOutlined style={{ marginRight: 8 }} />} placeholder="Senha" style={{ padding: "10px 16px" }} />
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit" className="mb-2"> 
          Entrar
        </Button>
        ou <Link href="/criar-conta">Crie uma conta!</Link>
      </Form.Item>
    </Form>
  );
}
