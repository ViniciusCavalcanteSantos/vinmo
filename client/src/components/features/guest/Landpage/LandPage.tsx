'use client'

import React from "react";
import GuestHeader from "@/components/common/layout/GuestHeader";
import Link from "next/link";
import {useT} from "@/i18n/client";
import HeroSection from "@/components/features/guest/Landpage/_components/HeroSection";
import FeaturesSection from "@/components/features/guest/Landpage/_components/FeaturesSection";
import ParallaxSection from "@/components/features/guest/Landpage/_components/ParallaxSection";
import CTASection from "@/components/features/guest/Landpage/_components/CTASection";

export default function Page() {
  const {t} = useT('common');

  return (
    <div
      className="relative min-h-screen bg-ant-bg text-ant-text selection:bg-ant-primary selection:text-white">
      <GuestHeader/>

      <main>
        <HeroSection/>
        <FeaturesSection/>
        <ParallaxSection/>
        <CTASection/>
      </main>

      {/* Footer Simples */}
      <footer className="py-12 border-t border-ant-border bg-ant-bg text-center text-ant-text-ter text-sm">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p>© 2025 Photon Cloud. All rights reserved.</p>
          <div className="flex gap-8 font-medium">
            <Link href="/legal/privacy-policy"
                  className="hover:text-ant-text transition-colors">{t('seo.privacy_policy.title')}</Link>
            <Link href="/legal/terms-of-service"
                  className="hover:text-ant-text transition-colors">{t('seo.terms_of_service.title')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}