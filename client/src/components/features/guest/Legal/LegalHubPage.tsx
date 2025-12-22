'use client'

import React from "react";
import Link from "next/link";
import {Card} from "antd";
import {ArrowRightOutlined, FileTextOutlined, SafetyCertificateOutlined} from "@ant-design/icons";
import GuestHeader from "@/components/common/layout/GuestHeader"; // Ajuste o caminho conforme necessário
import {useT} from "@/i18n/client";

export default function LegalHubPage() {
  const {t} = useT('legal');

  const cards = [
    {
      key: 'privacy',
      href: '/legal/privacy-policy',
      icon: <SafetyCertificateOutlined className="text-4xl text-ant-primary"/>,
      title: t('hub.privacy_card.title'),
      description: t('hub.privacy_card.description'),
    },
    {
      key: 'terms',
      href: '/legal/terms-of-service',
      icon: <FileTextOutlined className="text-4xl text-ant-primary"/>,
      title: t('hub.terms_card.title'),
      description: t('hub.terms_card.description'),
    }
  ];

  return (
    <div className="min-h-screen bg-ant-bg-layout">
      <GuestHeader/>

      <main className="pt-36 pb-20 container mx-auto px-6">
        {/* Cabeçalho da Página */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-medium text-ant-text mb-6">
            {t('hub.title')}
          </h1>
          <p className="text-lg text-ant-text-sec leading-relaxed">
            {t('hub.subtitle')}
          </p>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {cards.map((card) => (
            <Link key={card.key} href={card.href} className="group h-full">
              <Card
                hoverable
                className="h-full border-ant-border bg-ant-bg-elevated group-hover:-translate-y-1 transition-transform duration-300"
                styles={{
                  body: {padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column'}
                }}
              >
                <div className="flex flex-col h-full">
                  <div
                    className="mb-6 p-4 bg-ant-bg w-fit rounded-2xl border border-ant-border group-hover:border-ant-primary/50 transition-colors group-hover:[&_svg]:fill-ant-primary"
                  >
                    {card.icon}
                  </div>

                  <h2
                    className="text-2xl font-semibold text-ant-text mb-4 group-hover:text-ant-primary transition-colors">
                    {card.title}
                  </h2>

                  <p className="text-ant-text-sec text-base leading-relaxed mb-8 flex-grow">
                    {card.description}
                  </p>

                  <div className="flex items-center text-ant-primary font-medium mt-auto group-hover:underline">
                    {t('hub.read_document')}
                    <ArrowRightOutlined className="ml-2 group-hover:translate-x-1 transition-transform"/>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

      </main>
    </div>
  );
}