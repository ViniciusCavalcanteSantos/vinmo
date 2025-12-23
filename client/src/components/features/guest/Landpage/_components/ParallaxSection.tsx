'use client'

import React, {useRef} from "react";
import {useT} from "@/i18n/client";
import {CheckCircleFilled} from "@ant-design/icons";
import {motion, useScroll, useTransform} from "framer-motion";
import teste from "@/assets/teste.jpeg"
import Image from "next/image";

export default function ParallaxSection() {
  const {t} = useT('common');
  const targetRef = useRef(null);

  const {scrollYProgress} = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={targetRef} className="py-32 relative overflow-hidden flex items-center min-h-[90vh]">
      {/* Background Abstract */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-ant-primary/5 via-transparent to-transparent -z-20"/>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

        {/* Text Content */}
        <motion.div style={{y: yText, opacity: opacityFade}}>
          <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-none">
            {t('parallax.title', {defaultValue: 'Focus on shooting.\nWe sort the rest.'})}
          </h2>
          <p className="text-xl text-ant-text-sec mb-10 leading-relaxed">
            {/* Texto corrigido aqui */}
            {t('parallax.desc', {defaultValue: 'Imagine finishing an event and having all photos already sorted into private galleries ready for delivery before you even get home. That is the power of Photon Cloud.'})}
          </p>

          <ul className="space-y-5 mb-8">
            {[
              'Unlimited Storage for Active Events',
              'Smart Filtering & Search',
              'Real-time Sorting Progress'
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-xl font-medium text-ant-text">
                <CheckCircleFilled className="text-ant-primary text-2xl"/> {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Visual Content - Mockup */}
        <motion.div
          style={{y: yImage, opacity: opacityFade}}
          className="relative perspective-1000"
        >
          {/* Mockup Card */}
          <div
            className="relative z-10 bg-ant-bg-elevated border border-ant-border rounded-3xl shadow-2xl p-6 rotate-y-12 rotate-3 hover:rotate-0 transition-all duration-700 ease-out">
            {/* Header do Mockup */}
            <div className="flex items-center gap-2 mb-4 border-b border-ant-border pb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"/>
              <div className="w-3 h-3 rounded-full bg-yellow-500"/>
              <div className="w-3 h-3 rounded-full bg-green-500"/>
              <div className="ml-auto text-xs text-ant-text-ter font-mono">photon_dashboard.exe</div>
            </div>

            {/* Conteúdo do Mockup (A Galeria Simulada) */}
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-ant-bg rounded-lg overflow-hidden relative group">
                  <div className="absolute inset-0 bg-ant-text-ter/10 animate-pulse"
                       style={{animationDelay: `${i * 0.2}s`}}/>

                  <Image src={teste} alt={''} width='300' className='w-full h-full object-cover'/>
                  {/* Simulação de rosto detectado */}
                  <div
                    className="absolute top-2 right-2 w-6 h-6 border-2 border-ant-primary rounded-md opacity-0 group-hover:opacity-100 transition-opacity"/>
                </div>
              ))}
            </div>

            {/* Texto Central */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="bg-ant-bg-elevated/90 backdrop-blur border border-ant-primary/30 px-6 py-3 rounded-full shadow-2xl text-ant-primary font-mono text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"/>
                Processing Faces...
              </div>
            </div>
          </div>

          {/* Sombra/Glow atrás */}
          <div className="absolute inset-0 bg-ant-primary/20 blur-[100px] -z-10"/>
        </motion.div>

      </div>
    </section>
  );
}