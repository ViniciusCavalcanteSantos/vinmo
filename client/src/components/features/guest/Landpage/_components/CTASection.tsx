'use client'

import React from "react";
import Link from "next/link";
import {useT} from "@/i18n/client";
import {Button} from "antd";
import {motion} from "framer-motion";
import {scaleIn} from "../_config/animations";

export default function CTASection() {
  const {t} = useT('common');

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Grid Background */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"/>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{once: true}}
          className="max-w-5xl mx-auto"
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ant-primary/10 text-ant-primary border border-ant-primary/20 mb-8">
            <span className="relative flex h-3 w-3">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ant-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-ant-primary"></span>
            </span>
            <span className="text-sm font-semibold tracking-wide">Ready for Production</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-ant-text">
            {t('cta.title', {defaultValue: 'Transform Your Workflow'})}
          </h2>

          <p className="text-2xl text-ant-text-sec mb-12 max-w-2xl mx-auto">
            {t('cta.subtitle', {defaultValue: 'Join thousands of professional photographers saving time with Photon.'})}
          </p>

          <div className="flex flex-col items-center">
            <Link href="/auth/signup">
              <Button
                type="primary"
                size="large"
                className="h-20 px-16 text-2xl font-bold rounded-full shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] hover:shadow-[0_0_60px_-10px_rgba(59,130,246,0.8)] hover:scale-105 transition-all border-none bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {t('seo.signup.title')}
              </Button>
            </Link>

            <p className="mt-8 text-base text-ant-text-ter font-medium flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
              {t('cta.note', {defaultValue: 'Free tier available. No credit card required.'})}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}