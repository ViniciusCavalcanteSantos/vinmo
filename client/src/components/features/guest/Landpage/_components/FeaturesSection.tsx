'use client'

import React, {useRef} from "react";
import {useT} from "@/i18n/client";
import {SafetyCertificateOutlined, ThunderboltOutlined, UsergroupAddOutlined} from "@ant-design/icons";
import {motion, useInView} from "framer-motion";
import {fadeIn} from "../_config/animations";

export default function FeaturesSection() {
  const {t} = useT('common');

  return (
    <section id="features" className="py-32 bg-ant-bg-elevated relative overflow-hidden">
      {/* Decoração de Fundo */}
      <div
        className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ant-border to-transparent"/>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('features.title', {defaultValue: 'Workflow on Autopilot'})}
          </h2>
          <p className="text-ant-text-sec text-xl">
            {t('features.subtitle', {defaultValue: 'Eliminate hours of culling and sorting. Let Photon handle the organization.'})}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<ThunderboltOutlined className="text-5xl text-yellow-500"/>}
            title={t('features.speed.title', {defaultValue: 'Instant Organization'})}
            desc={t('features.speed.desc', {defaultValue: 'Upload thousands of photos and have them separated by person in minutes.'})}
            delay={0}
          />
          <FeatureCard
            icon={<UsergroupAddOutlined className="text-5xl text-blue-500"/>}
            title={t('features.ai.title', {defaultValue: 'Facial Recognition'})}
            desc={t('features.ai.desc', {defaultValue: 'Our AI identifies every face and groups photos into individual client folders automatically.'})}
            delay={0.2}
          />
          <FeatureCard
            icon={<SafetyCertificateOutlined className="text-5xl text-green-500"/>}
            title={t('features.security.title', {defaultValue: 'Secure Storage'})}
            desc={t('features.security.desc', {defaultValue: 'Your work is encrypted and stored safely until you decide to deliver it.'})}
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({icon, title, desc, delay}: {
  icon: React.ReactNode,
  title: string,
  desc: string,
  delay: number
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {once: true, margin: "-50px"});

  return (
    <motion.div
      ref={ref}
      variants={fadeIn}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{delay}}
      className="p-10 rounded-3xl bg-ant-bg border border-ant-border hover:border-ant-primary/50 transition-all duration-300 group hover:-translate-y-2"
    >
      <div
        className="mb-8 p-5 rounded-2xl bg-ant-bg-elevated w-fit group-hover:bg-ant-primary/10 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-ant-text group-hover:text-ant-primary transition-colors">{title}</h3>
      <p className="text-ant-text-sec text-lg leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}