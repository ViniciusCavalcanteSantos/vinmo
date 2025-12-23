'use client'

import {motion} from "framer-motion";
import React from "react";

export default function HeroMockup() {
  return (
    <motion.div
      initial={{opacity: 0, y: 40}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.8, ease: "easeOut"}}
      className="relative mx-auto max-w-lg"
    >
      {/* Glow */}
      <div
        className="absolute -inset-6 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-3xl rounded-3xl"/>

      {/* Card */}
      <div
        className="relative bg-ant-bg-elevated/80 backdrop-blur-xl border border-ant-border rounded-3xl shadow-2xl overflow-hidden">
        {/* Header fake */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-ant-border">
          <div className="flex gap-1">
            <span className="w-3 h-3 rounded-full bg-red-400"/>
            <span className="w-3 h-3 rounded-full bg-yellow-400"/>
            <span className="w-3 h-3 rounded-full bg-green-400"/>
          </div>
          <span className="ml-4 text-sm text-ant-text-ter">Photon Dashboard</span>
        </div>

        {/* Conteúdo fake */}
        <div className="p-6 space-y-4">
          <div className="h-40 rounded-xl bg-gradient-to-br from-ant-primary/20 to-purple-500/20"/>
          <div className="grid grid-cols-3 gap-3">
            <div className="h-20 rounded-lg bg-ant-bg"/>
            <div className="h-20 rounded-lg bg-ant-bg"/>
            <div className="h-20 rounded-lg bg-ant-bg"/>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
