"use client";

import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        message.success("Connexion réussie !");
        router.push("/properties"); // page à créer après
      } else {
        message.error(data.message || "Erreur de connexion");
      }
    } catch (err) {
      message.error("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>
        <Form onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="email"
            label="Adresse email"
            rules={[{ required: true, message: "Veuillez entrer votre email" }]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mot de passe"
            rules={[
              { required: true, message: "Veuillez entrer votre mot de passe" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
            >
              Se connecter
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
