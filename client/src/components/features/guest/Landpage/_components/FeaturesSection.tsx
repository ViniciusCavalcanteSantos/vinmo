'use client'

import React, {useEffect, useRef, useState} from 'react';
import {useT} from '@/i18n/client';
import {SafetyCertificateOutlined, ThunderboltOutlined, UsergroupAddOutlined} from '@ant-design/icons';
import {motion, useScroll, useSpring, useTransform} from 'framer-motion';

// ----- dados (mesma lista) -----
const features = [
  {
    id: 'speed',
    color: 'from-amber-500/20 to-orange-600/20',
    iconColor: 'text-amber-500',
    Icon: ThunderboltOutlined,
    defaultTitle: 'Instant Organization',
    defaultDesc: 'Upload thousands of photos and have them separated by person in minutes.'
  },
  {
    id: 'ai',
    color: 'from-blue-500/20 to-cyan-600/20',
    iconColor: 'text-blue-500',
    Icon: UsergroupAddOutlined,
    defaultTitle: 'Facial Recognition',
    defaultDesc: 'Our AI identifies every face with 99.8% accuracy and groups photos automatically.'
  },
  {
    id: 'security',
    color: 'from-emerald-500/20 to-green-600/20',
    iconColor: 'text-emerald-500',
    Icon: SafetyCertificateOutlined,
    defaultTitle: 'Secure Storage',
    defaultDesc: 'Bank-grade encryption keeps your work safe. Share strictly what you want.'
  }
];

// ------------------------
// Helper: calcula stepSize e snapPoints de forma consistente
// - se `providedStepSize` for passado, usa-o
// - caso contrário calcula com base em startOffset + endPadding e total
// ------------------------
function computeSnapLayout(total: number, opts?: {
  providedStepSize?: number;
  startOffset?: number;
  endPadding?: number;
}) {
  const startOffset = opts?.startOffset ?? 0.15;
  const endPadding = opts?.endPadding ?? 0.10; // reserva final para 'respirar'
  if (typeof opts?.providedStepSize === 'number') {
    const stepSize = opts!.providedStepSize;
    const snapPoints = Array.from({length: total}, (_, i) => (i === 0 ? 0 : startOffset + ((i - 1) * stepSize)));
    return {stepSize, startOffset, endPadding, snapPoints};
  }

  const usableRange = Math.max(0, 1 - startOffset - endPadding);

  // Se só existir 1 card, usamos toda a usableRange
  const stepSize = total > 1 ? usableRange / (total - 1) : usableRange;

  const snapPoints = Array.from({length: total}, (_, i) => (i === 0 ? 0 : startOffset + ((i - 1) * stepSize)));
  return {stepSize, startOffset, endPadding, snapPoints};
}

// ------------------------------------------------------------------
// Hook reutilizável: useCardMotion (com "biased snap" embutido)
// - Se stepSize não for passado, calcula automaticamente com computeSnapLayout
// - Retorna estilo pronto para o motion.div
// - Expondo internals para poder debug
// ------------------------------------------------------------------
export function useCardMotion(options: {
  containerRef: React.RefObject<HTMLElement>;
  index: number;
  total: number;
  // controle fino
  stepSize?: number; // quanto cada card 'ocupa' do scroll (padrão calculado)
  startOffset?: number; // offset inicial (padrão 0.15)
  endPadding?: number; // espaço reservado no final (padrão 0.1)
  snap?: boolean; // true => animação só dispara ao cruzar um ponto (modo "snap")
  // Comportamento de "viés" (preferência de parar perto dos pontos)
  snapBias?: boolean; // ativa o viés preferencial
  snapRadius?: number; // quão perto precisa estar para ativar o viés (em progress 0..1)
  snapStrength?: number; // intensidade do viés (0..1)
  entryRangeFactor?: number; // quando snap=false, mapeia entrada para myEnter -> myEnter + stepSize * entryRangeFactor
  stiffness?: number;
  damping?: number;
}) {
  const {
    containerRef,
    index,
    total,
    stepSize: providedStepSize,
    startOffset: providedStartOffset,
    endPadding: providedEndPadding,
    snap = true,
    snapBias = true,
    snapRadius = 0.045,
    snapStrength = 0.14,
    entryRangeFactor = 0.6,
    stiffness = 160,
    damping = 20
  } = options;

  // Calcula layout (stepSize + snapPoints) de forma consistente
  const {stepSize, startOffset, endPadding, snapPoints} = computeSnapLayout(total, {
    providedStepSize,
    startOffset: providedStartOffset,
    endPadding: providedEndPadding
  });

  // progress relativo à seção
  const {scrollYProgress} = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const isLast = index === total - 1;

  // pontos base (mesma lógica conceitual do original)
  const myEnterPoint = index === 0 ? 0 : startOffset + ((index - 1) * stepSize);
  const nextEnterPoint = startOffset + (index * stepSize);

  // range usado para mapear 0 -> 1
  const eps = 0.001; // usado no modo snap para simular um "cliff"
  const entryRange = snap
    ? [myEnterPoint, myEnterPoint + eps]
    : [myEnterPoint, myEnterPoint + stepSize * entryRangeFactor];

  const rotateRange = snap
    ? [nextEnterPoint, nextEnterPoint + eps]
    : [nextEnterPoint, nextEnterPoint + stepSize * entryRangeFactor];

  // --- BIASED PROGRESS (viés preferencial) ---
  const biasedProgress = snapBias
    ? useTransform(scrollYProgress, (v) => {
      // encontra o ponto mais próximo
      let nearest = snapPoints[0];
      let bestDist = Math.abs(v - nearest);
      for (let p = 1; p < snapPoints.length; p++) {
        const d = Math.abs(v - snapPoints[p]);
        if (d < bestDist) {
          bestDist = d;
          nearest = snapPoints[p];
        }
      }

      // se muito longe, não aplicar viés
      if (bestDist > snapRadius) return v;

      const t = 1 - bestDist / snapRadius;
      return v + (nearest - v) * t * snapStrength;
    })
    : scrollYProgress;

  // Escolhe qual progress alimentar as molas: biasado (preferencial) ou cru
  const progressForMapping = biasedProgress;

  // target values (0..1) e suas molas
  const targetEnter = useTransform(progressForMapping, entryRange, [0, 1]);
  const springEnter = useSpring(targetEnter, {stiffness, damping});

  const targetRotate = useTransform(progressForMapping, rotateRange, [0, isLast ? 0 : 1]);
  const springRotate = useSpring(targetRotate, {stiffness, damping});

  // mapeamentos visuais (mesma geometria do original)
  const xStart = index === 0 ? 0 : -800;
  const yStart = index === 0 ? 0 : 100;

  const x = useTransform(springEnter, [0, 1], [xStart, 0]);
  const y = useTransform(springEnter, [0, 1], [yStart, 0]);
  const opacity = useTransform(springEnter, [0, 0.6], [index === 0 ? 1 : 0, 1]);

  const rotateEnd = index % 2 === 0 ? -3 : 3;

  const rotate = useTransform([springEnter, springRotate], ([enter, rot]) => {
    if (index === 0) {
      return rot * rotateEnd;
    }

    const entranceRotation = (1 - enter) * -45; // -45 -> 0 na entrada
    const exitRotation = rot * rotateEnd; // leve giro no momento de sair

    return entranceRotation + exitRotation;
  });

  return {
    // estilo pronto para aplicar no <motion.div style={{ ...style }}>
    style: {
      x,
      y,
      opacity,
      rotate,
      zIndex: index
    },
    // valores brutos (se precisar para lógica extra)
    internals: {
      scrollYProgress,
      biasedProgress,
      springEnter,
      springRotate,
      snapPoints,
      stepSize,
      startOffset,
      endPadding
    }
  };
}

// ------------------------------------------------------------------
// Debug overlay: mostra snapPoints (fácil de remover)
// - Renderiza dentro do container sticky, com marcadores posicionados verticalmente
// - Controlado pelo prop `debug`
// ------------------------------------------------------------------
function DebugSnapOverlay({containerRef, snapPoints}: {
  containerRef: React.RefObject<HTMLElement>;
  snapPoints: number[]
}) {
  // a overlay só é útil no cliente
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // permitimos toggle com `d`+`s` em dev para mostrar/ocultar rapidamente
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === 'd' && e.shiftKey) setVisible(v => !v);
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!containerRef.current) return null;
  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[999]">
      <div className="absolute left-0 top-0 w-full h-full flex flex-col items-start justify-start">
        {snapPoints.map((p, idx) => (
          <div key={idx} style={{top: `${p * 100}%`}} className="absolute left-4 flex items-center gap-2">
            <div className="w-2 h-8 bg-red-400/80"/>
            <div
              className="text-xs font-mono bg-black/60 text-white px-2 rounded">{`#${idx + 1} ${Math.round(p * 1000) / 10}%`}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Components: FeaturesSection (simplificado) + Card (usa o hook)
// - FeaturesSection agora aceita props: snap, debug, providedStepSize, startOffset, endPadding
// - Debug overlay fácil de remover (passando debug={false})
// ------------------------------------------------------------------
export default function FeaturesSection({snap = true, debug = false, providedStepSize, startOffset, endPadding}: {
  snap?: boolean;
  debug?: boolean;
  providedStepSize?: number;
  startOffset?: number;
  endPadding?: number;
}) {
  const {t} = useT('common');
  const containerRef = useRef<HTMLDivElement>(null);

  // calculamos layout global para passar pro overlay (mantendo consistência)
  const {stepSize, snapPoints} = computeSnapLayout(features.length, {providedStepSize, startOffset, endPadding});

  return (
    <section ref={containerRef} id="features" className="relative h-[220vh] bg-ant-bg">

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
          {features.map((feature, i) => (
            <Card
              key={feature.id}
              containerRef={containerRef}
              i={i}
              total={features.length}
              {...feature}
              t={t}
              snap={snap}
              providedStepSize={providedStepSize}
              startOffset={startOffset}
              endPadding={endPadding}
            />
          ))}

          {debug && <DebugSnapOverlay containerRef={containerRef} snapPoints={snapPoints}/>}
        </div>

      </div>
    </section>
  );
}

interface CardProps {
  i: number;
  total: number;
  id: string;
  defaultTitle: string;
  defaultDesc: string;
  color: string;
  iconColor: string;
  Icon: any;
  t: any;
  containerRef: React.RefObject<HTMLDivElement>;
  snap?: boolean;
  providedStepSize?: number;
  startOffset?: number;
  endPadding?: number;
}

const Card = ({
                i,
                total,
                defaultTitle,
                defaultDesc,
                color,
                iconColor,
                Icon,
                t,
                id,
                containerRef,
                snap = true,
                providedStepSize,
                startOffset,
                endPadding
              }: CardProps) => {
  // usa o hook reutilizável
  const {style, internals} = useCardMotion({
    containerRef,
    index: i,
    total,
    snap,
    stepSize: providedStepSize,
    startOffset,
    endPadding
  });

  return (
    <motion.div
      style={style}
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
