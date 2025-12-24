'use client'

import {motion} from "framer-motion";
import React from "react";
import Image from "next/image";
import photographer from "@/assets/woman-photographer.png"

export default function HeroPerson() {
  return (
    <motion.div
      initial={{opacity: 0, y: 40, scale: 0.95}}
      animate={{opacity: 1, y: 0, scale: 1}}
      transition={{duration: 0.8, ease: "easeOut", delay: 0.2}}
      className="relative mx-auto max-w-[500px] mt-10 lg:mt-0 flex flex-col items-center justify-end"
    >
      {/* 1. Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-[80px] rounded-full -z-20 pointer-events-none"/>

      {/* 2. Boxes */}
      <motion.div
        className="absolute bottom-0 w-[90%] h-[70%] bg-ant-bg-elevated/60 d-backdrop-blur-xl border border-ant-border/50 rounded-3xl -z-11 shadow-2xl"
        style={{transformOrigin: "100% 100%"}}
        initial={{rotate: -180}}
        animate={{rotate: -2}}
        transition={{
          duration: 0.9,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
      <motion.div
        className="absolute bottom-0 w-[90%] h-[70%] bg-ant-bg-elevated/90 d-backdrop-blur-sm border border-ant-border/30 rounded-3xl -z-10 shadow-lg"
        style={{transformOrigin: "0% 100%"}}
        initial={{rotate: 180}}
        animate={{rotate: 3}}
        transition={{
          duration: 0.9,
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      {/* 2. Imagem */}
      <div
        className="absolute overflow-hidden bottom-0 w-[90%] h-[100%] rounded-3xl rotate-[3deg] -z-9">
        <motion.div
          initial={{opacity: 0, y: 100}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.9}}
          className="absolute -bottom-3 -rotate-[3deg] w-[120%] max-w-[500px] left-1/2 -translate-x-[52%]"
        >
          <Image
            src={photographer}
            alt="Professional Photographer using Photon Cloud"
            priority
            className="object-contain drop-shadow-2xl mask-image-gradient-b"
          />
        </motion.div>
      </div>

      {/* 3. Imagem que define a largura */}
      <div className="relative z-10 opacity-0">
        <Image src={photographer} alt="" className="w-[120%] h-auto"/>
      </div>

      {/* 4. Badges Flutuantes */}
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 0.7}}
        className="absolute top-[20%] left-[-10px] md:-left-8 z-30 floating-css"
      >
        <div
          className="flex items-center gap-3 bg-ant-bg-elevated/90 backdrop-blur-md border border-ant-border/60 rounded-2xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-500/10 rounded-full text-xl">
            🤖
          </div>
          <div>
            <p className="text-xs text-ant-text-ter uppercase font-bold tracking-wider">Analysis</p>
            <p className="text-sm font-semibold text-ant-text">AI Face Match</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 0.7}}
        className="absolute bottom-[15%] right-[-10px] md:-right-4 z-30 floating-css"
      >
        <div
          className="flex items-center gap-3 bg-ant-bg-elevated/90 backdrop-blur-md border border-ant-border/60 rounded-2xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="flex items-center justify-center w-10 h-10 bg-green-500/10 rounded-full text-xl">
            📸
          </div>
          <div>
            <p className="text-xs text-ant-text-ter uppercase font-bold tracking-wider">Status</p>
            <p className="text-sm font-semibold text-ant-text">Photos Delivered</p>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}