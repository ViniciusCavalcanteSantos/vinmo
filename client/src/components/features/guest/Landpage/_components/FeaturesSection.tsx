'use client'

import React, {useRef} from "react";
import {useT} from "@/i18n/client";
import {SafetyCertificateOutlined, ThunderboltOutlined, UsergroupAddOutlined} from "@ant-design/icons";
import {motion, MotionValue, useScroll, useSpring, useTransform} from "framer-motion";

const features = [
  {
    id: 'speed',
    color: "from-amber-500/20 to-orange-600/20",
    iconColor: "text-amber-500",
    Icon: ThunderboltOutlined,
    defaultTitle: 'Instant Organization',
    defaultDesc: 'Upload thousands of photos and have them separated by person in minutes.'
  },
  {
    id: 'ai',
    color: "from-blue-500/20 to-cyan-600/20",
    iconColor: "text-blue-500",
    Icon: UsergroupAddOutlined,
    defaultTitle: 'Facial Recognition',
    defaultDesc: 'Our AI identifies every face with 99.8% accuracy and groups photos automatically.'
  },
  {
    id: 'security',
    color: "from-emerald-500/20 to-green-600/20",
    iconColor: "text-emerald-500",
    Icon: SafetyCertificateOutlined,
    defaultTitle: 'Secure Storage',
    defaultDesc: 'Bank-grade encryption keeps your work safe. Share strictly what you want.'
  }
];

export default function FeaturesSection() {
  const {t} = useT('common');
  const containerRef = useRef<HTMLDivElement>(null);

  const {scrollYProgress} = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <section ref={containerRef} id="features" className="relative h-[250vh] bg-ant-bg">

      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center pt-10 md:pt-20">

        <div className="w-full px-6 z-10 text-center mb-8  shrink-0">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            {t('features.title', {defaultValue: 'Workflow on Autopilot'})}
          </h2>
          <p className="text-ant-text-sec text-lg md:text-xl">
            {t('features.subtitle', {defaultValue: 'Eliminate hours of culling.'})}
          </p>
        </div>

        <div className="relative w-full max-w-5xl h-[400px] md:h-[500px] flex items-center justify-center px-4">
          {features.map((feature, i) => {
            return (
              <Card
                key={feature.id}
                i={i}
                {...feature}
                progress={scrollYProgress}
                total={features.length}
                t={t}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}

interface CardProps {
  i: number;
  id: string;
  defaultTitle: string;
  defaultDesc: string;
  color: string;
  iconColor: string;
  Icon: any;
  progress: MotionValue<number>;
  total: number;
  t: any;
}

const Card = ({i, defaultTitle, defaultDesc, color, iconColor, Icon, progress, total, t, id}: CardProps) => {

  // Verifica se é o último card
  const isLast = i === total - 1;

  const stepSize = 0.3;
  const startOffset = 0.15;

  // Gatilhos
  const myEnterPoint = i === 0 ? 0 : startOffset + ((i - 1) * stepSize);
  const nextEnterPoint = startOffset + (i * stepSize);

  // --- MOLAS ---

  // 1. Mola de Entrada
  const targetEnter = useTransform(
    progress,
    [myEnterPoint, myEnterPoint + 0.001],
    [0, 1]
  );
  const springEnter = useSpring(targetEnter, {stiffness: 160, damping: 20});

  // 2. Mola de Rotação (Saída)
  // CORREÇÃO AQUI: Se for o último card, o alvo é sempre 0 (não gira).
  const targetRotate = useTransform(
    progress,
    [nextEnterPoint, nextEnterPoint + 0.001],
    [0, isLast ? 0 : 1] // <--- SE FOR O ÚLTIMO, PERMANECE EM 0
  );

  const springRotate = useSpring(targetRotate, {stiffness: 160, damping: 20});


  // --- MAPEAMENTO VISUAL ---

  const xStart = i === 0 ? 0 : -800;
  const yStart = i === 0 ? 0 : 100;

  const x = useTransform(springEnter, [0, 1], [xStart, 0]);
  const y = useTransform(springEnter, [0, 1], [yStart, 0]);
  const opacity = useTransform(springEnter, [0, 0.6], [i === 0 ? 1 : 0, 1]);

  // Rotação
  const rotateEnd = i % 2 === 0 ? -3 : 3;

  const rotate = useTransform(
    [springEnter, springRotate],
    ([enter, rot]) => {
      // Se for o último card, 'rot' será sempre 0 (graças à correção acima).
      // Logo, ele só executa a animação de entrada e para reto.

      if (i === 0) {
        return rot * rotateEnd;
      }

      // Fase 1: Chegando (-45 -> 0)
      const entranceRotation = (1 - enter) * -45;

      // Fase 2: Virando fundo (0 -> +/- 3)
      const exitRotation = rot * rotateEnd;

      return entranceRotation + exitRotation;
    }
  );

  return (
    <motion.div
      style={{
        x,
        y,
        opacity,
        rotate,
        zIndex: i,
      }}
      className="absolute w-full max-w-4xl h-full md:h-[450px] bg-ant-bg-elevated rounded-3xl border border-ant-border/60 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row will-change-transform"
    >
      {/* Conteúdo Esquerdo */}
      <div className="flex flex-col justify-center w-full md:w-1/2 p-8 gap-4 z-10 relative">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-ant-bg border border-ant-border shadow-sm ${iconColor}`}>
          <Icon className="text-2xl"/>
        </div>

        <div>
          <h3 className="text-2xl md:text-3xl font-bold mb-3 text-ant-text">
            {t(`features.${id}.title`, {defaultValue: defaultTitle})}
          </h3>
          <p className="text-ant-text-sec text-base md:text-lg leading-relaxed">
            {t(`features.${id}.desc`, {defaultValue: defaultDesc})}
          </p>
        </div>

        <div className="mt-auto text-xs font-mono text-ant-text-ter uppercase">
          0{i + 1}
        </div>
      </div>

      {/* Visual Direito */}
      <div className={`relative w-full md:w-1/2 min-h-[200px] md:h-full overflow-hidden bg-gradient-to-br ${color}`}>
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="w-[250px] h-[250px] bg-white rounded-full blur-[90px]"/>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="text-[150px] md:text-[220px] opacity-10 text-white mix-blend-overlay -rotate-12"/>
        </div>
      </div>
    </motion.div>
  );
};