'use client'

import React from "react";
import Link from "next/link";
import {useT} from "@/i18n/client";
import {Button} from "antd";
import {ArrowRightOutlined} from "@ant-design/icons";
import {motion} from "framer-motion";
import {fadeIn, staggerContainer} from "../_config/animations";
import HeroPerson from "@/components/features/guest/Landpage/_components/HeroPerson";

export default function HeroSection() {
  const {t} = useT('common');

  return (
    <section className="relative min-h-[80vh] flex flex-col  overflow-hidden bg-ant-bg py-20">
      {/* ================= MAIN CONTENT ================= */}
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >

          {/* COLUNA ESQUERDA: Texto */}
          <div className="text-center lg:text-left order-1 pb-20 lg:pb-0">
            <motion.div variants={fadeIn} className="mb-6 inline-block">
              <span
                className="px-5 py-2 rounded-full bg-ant-bg-elevated/50 backdrop-blur-md border border-ant-border text-ant-primary text-sm font-bold tracking-widest uppercase shadow-sm">
                🚀 {t('seo.landpage.tagline', {defaultValue: 'Next-Gen Workflow'})}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight mb-8 leading-[1.1] drop-shadow-sm"
            >
              {t('seo.landpage.title_start', {defaultValue: 'Sort Photos'})} <br className="hidden md:block"/>
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x pb-4">
                {t('seo.landpage.title_highlight', {defaultValue: 'With AI Precision'})}
              </span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-xl text-ant-text-sec mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {t('seo.landpage.description')}
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button
                  type="primary"
                  size="large"
                  className="w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-2xl shadow-lg shadow-ant-primary/25 hover:scale-105 transition-transform border-none"
                  icon={<ArrowRightOutlined/>}
                  iconPlacement="end"
                >
                  {t('seo.signup.title')}
                </Button>
              </Link>
              <Link href="#how-it-works" className="w-full sm:w-auto">
                <Button
                  type="default"
                  size="large"
                  className="w-full sm:w-auto h-14 px-8 text-lg bg-ant-bg-elevated/40 backdrop-blur-md border-ant-border text-ant-text hover:text-ant-primary hover:border-ant-primary rounded-2xl"
                >
                  {t('common.learn_more', {defaultValue: 'How it works'})}
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* COLUNA DIREITA: Imagem da Pessoa (HeroPerson) */}
          <div className="order-2 flex justify-center lg:justify-end relative">
            <HeroPerson/>
          </div>
        </motion.div>
      </div>

      {/* ================= SLOT PARA SVG WAVE ================= */}
      {/*<div className="absolute bottom-0 left-0 w-full leading-[0] z-20 pointer-events-none">*/}
      {/*  <svg id="wave" viewBox="0 0 1440 160" version="1.1"*/}
      {/*       xmlns="http://www.w3.org/2000/svg">*/}
      {/*    <defs>*/}
      {/*      <linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0">*/}
      {/*        <stop stopColor="rgba(99, 102, 241, 1)" offset="0%"/>*/}
      {/*        /!* azul-500 *!/*/}
      {/*        <stop stopColor="rgba(139, 92, 246, 1)" offset="50%"/>*/}
      {/*        /!* roxo-500 *!/*/}
      {/*        <stop stopColor="rgba(236, 72, 153, 1)" offset="100%"/>*/}
      {/*        /!* rosa-500 *!/*/}
      {/*      </linearGradient>*/}
      {/*    </defs>*/}
      {/*    <path fill="url(#sw-gradient-0)"*/}
      {/*          d="M0,144L60,130.7C120,117,240,91,360,74.7C480,59,600,53,720,64C840,75,960,101,1080,98.7C1200,96,1320,64,1440,45.3C1560,27,1680,21,1800,21.3C1920,21,2040,27,2160,26.7C2280,27,2400,21,2520,32C2640,43,2760,69,2880,88C3000,107,3120,117,3240,122.7C3360,128,3480,128,3600,114.7C3720,101,3840,75,3960,77.3C4080,80,4200,112,4320,120C4440,128,4560,112,4680,98.7C4800,85,4920,75,5040,80C5160,85,5280,107,5400,114.7C5520,123,5640,117,5760,112C5880,107,6000,101,6120,106.7C6240,112,6360,128,6480,133.3C6600,139,6720,133,6840,133.3C6960,133,7080,139,7200,133.3C7320,128,7440,112,7560,96C7680,80,7800,64,7920,50.7C8040,37,8160,27,8280,21.3C8400,16,8520,16,8580,16L8640,16L8640,160L8580,160C8520,160,8400,160,8280,160C8160,160,8040,160,7920,160C7800,160,7680,160,7560,160C7440,160,7320,160,7200,160C7080,160,6960,160,6840,160C6720,160,6600,160,6480,160C6360,160,6240,160,6120,160C6000,160,5880,160,5760,160C5640,160,5520,160,5400,160C5280,160,5160,160,5040,160C4920,160,4800,160,4680,160C4560,160,4440,160,4320,160C4200,160,4080,160,3960,160C3840,160,3720,160,3600,160C3480,160,3360,160,3240,160C3120,160,3000,160,2880,160C2760,160,2640,160,2520,160C2400,160,2280,160,2160,160C2040,160,1920,160,1800,160C1680,160,1560,160,1440,160C1320,160,1200,160,1080,160C960,160,840,160,720,160C600,160,480,160,360,160C240,160,120,160,60,160L0,160Z"></path>*/}
      {/*  </svg>*/}
      {/*</div>*/}

    </section>
  );
}