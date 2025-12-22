'use client'


import {useScrollThreshold} from "@/hooks/useScrollThreshold";
import Link from "next/link";
import {useScrollSpy} from "@/hooks/useScrollSpy";
import React from "react";
import SidebarGuide from "@/components/features/guest/Legal/_components/SidebarGuide";
import {useT} from "@/i18n/client";
import GuestHeader from "@/components/common/layout/GuestHeader";
import PhotonLogo from "@/components/ui/icons/PhotonLogo";

export default function TermsOfService() {
  const isScrolled = useScrollThreshold();
  const {t} = useT('legal')

  const sections = [
    {id: 'terms-overview', title: t('terms.overview.title')},
    {id: 'eligibility-accounts', title: t('terms.eligibility.title')},
    {id: 'service-credits', title: t('terms.credits.title')},
    {id: 'storage-security', title: t('terms.storage.title')},
    {id: 'content-biometrics', title: t('terms.content.title')},
    {id: 'subscriptions-payments', title: t('terms.subscriptions.title')},
    {id: 'cancellation-termination', title: t('terms.cancellation.title')},
    {id: 'prohibited-use', title: t('terms.prohibited.title')},
    {id: 'intellectual-property', title: t('terms.ip.title')},
    {id: 'disclaimers-liability', title: t('terms.disclaimers.title')},
    {id: 'indemnification', title: t('terms.indemnification.title')},
    {id: 'dispute-resolution', title: t('terms.dispute.title')},
    {id: 'general-provisions', title: t('terms.general.title')},
  ];
  const sectionIds = sections.map(s => s.id)
  const {activeId, setManualScroll} = useScrollSpy(sectionIds, 200, sectionIds[0])


  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    window.history.pushState(null, '', `#${id}`);
    setManualScroll(id);

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({behavior: 'smooth'});
    }
  };

  return (
    <div className='min-h-screen pb-20'>
      <GuestHeader/>

      {/* STICKY HEADER */}
      <div
        className={`fixed left-0 w-full z-50 shadow-md h-18 flex items-center bg-ant-bg-elevated border-t border-t-ant-border transition-[top] duration-150 ease-out ${isScrolled ? 'top-0' : 'top-18'}`}>
        <div className="container mx-auto overflow-x-hidden">
          <div className="flex items-center">
            <div
              className={`transition-[width] duration-150 ease-out ${isScrolled ? "w-6 mr-3" : "w-0"} overflow-hidden`}>
              <PhotonLogo className={`w-6`}/>
            </div>
            <h1
              className={`font-semibold text-ant-text-sec transition-all duration-300 ${isScrolled ? 'text-xl' : 'text-2xl'}`}>
              Legal
            </h1>
          </div>
        </div>
      </div>

      <main className={`${isScrolled ? 'pt-18' : 'pt-36'}`}>
        <div className="container mx-auto pt-8">

          {/* BREADCRUMBS */}
          <div className="flex text-base text-ant-text-sec gap-2 px-8">
            <Link href='/legal'>{t('legal_information')}</Link>
            /
            <Link href='/legal/terms-of-service'>{t('terms_of_service')}</Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] mt-4 p-4 lg:p-8 relative">
            {/* SIDEBAR NAVIGATION */}
            <SidebarGuide title={t('terms_of_service')} sections={sections} handleClick={handleLinkClick}
                          activeId={activeId}/>

            {/* CONTENT AREA */}
            <article className="text-base leading-7 max-w-3xl pl-12 text-ant-text-sec">
              <h1 className='text-5xl font-medium text-ant-text mb-4'>{t('terms.title')}</h1>

              {/* OVERVIEW */}
              <div id="terms-overview" className="scroll-mt-32 mt-10">
                <h2 className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>{t('terms.overview.title')}</h2>
                <p className="mb-6"><em>{t('terms.overview.last_updated')}</em></p>

                <p className="mb-6">{t('terms.overview.intro_1')}</p>
                <p className="mb-6">{t('terms.overview.intro_2')}</p>

                <p className="mb-6 p-4 bg-ant-bg-elevated rounded border border-ant-border">
                  <strong>{t('terms.overview.arbitration.label')}</strong> {t('terms.overview.arbitration.text')}
                </p>

                <nav className="mb-10" aria-label={t('table_of_contents')}>
                  <p className='mb-6'>{t('terms.toc_header')}</p>

                  <ul className='flex flex-col gap-2 list-disc pl-10'>
                    {sections.map(section => (
                      <li key={section.id}>
                        <Link
                          href={`#${section.id}`}
                          onClick={(e) => handleLinkClick(e, section.id)}
                          className="hover:text-ant-primary transition-colors"
                        >
                          {section.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* ELIGIBILITY */}
              <div id="eligibility-accounts" className="scroll-mt-32 mt-20">
                <h2
                  className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>{t('terms.eligibility.title')}</h2>

                <p className="mb-6">
                  <strong>{t('terms.eligibility.professional_use.label')}</strong> {t('terms.eligibility.professional_use.text')}
                </p>

                <p className="mb-6">
                  <strong>{t('terms.eligibility.account_security.label')}</strong> {t('terms.eligibility.account_security.text')}
                </p>

                <p className="mb-6">
                  <strong>{t('terms.eligibility.account_info.label')}</strong> {t('terms.eligibility.account_info.text')}
                </p>
              </div>

              {/* SERVICE CREDITS */}
              <div id="service-credits" className="scroll-mt-32 mt-20">
                <h2 className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>{t('terms.credits.title')}</h2>

                <p className="mb-6">
                  <strong>{t('terms.credits.system.label')}</strong> {t('terms.credits.system.text')}
                </p>

                <p className="mb-6">
                  <strong>{t('terms.credits.allocations.label')}</strong> {t('terms.credits.allocations.text_start')}
                  <strong>{t('terms.credits.allocations.text_bold')}</strong> {t('terms.credits.allocations.text_end')}
                </p>

                <p className="mb-6 bg-ant-bg-elevated p-4 rounded border border-ant-border">
                  <strong>{t('terms.credits.changes.label')}</strong> {t('terms.credits.changes.text_start')}
                  <strong>{t('terms.credits.changes.text_bold')}</strong> {t('terms.credits.changes.text_end')}
                </p>
              </div>

              {/* STORAGE & SECURITY */}
              <div id="storage-security" className="scroll-mt-32 mt-20">
                <h2 className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>{t('terms.storage.title')}</h2>

                <p className="mb-6">
                  <strong>{t('terms.storage.infrastructure.label')}</strong> {t('terms.storage.infrastructure.text_start')}
                  <strong>{t('terms.storage.infrastructure.aws')}</strong>{t('terms.storage.infrastructure.text_end')}
                </p>

                <p className="mb-6">
                  <strong>{t('terms.storage.security.label')}</strong> {t('terms.storage.security.text')}
                </p>

                <div
                  className="mb-6 p-4 rounded border border-yellow-200/50 bg-yellow-50/50 dark:bg-yellow-900/10 dark:border-yellow-800/30">
                  <p className="font-semibold text-ant-text mb-2">{t('terms.storage.backup_warning.title')}</p>
                  <p>
                    {t('terms.storage.backup_warning.text_start')}
                    <strong>{t('terms.storage.backup_warning.text_bold')}</strong>. {t('terms.storage.backup_warning.text_end')}
                  </p>
                </div>
              </div>

              {/* CONTENT & BIOMETRICS */}
              <div id="content-biometrics" className="scroll-mt-32 mt-20">
                <h2 className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>{t('terms.content.title')}</h2>

                <p className="mb-6">
                  <strong>{t('terms.content.ownership.label')}</strong> {t('terms.content.ownership.text')}
                </p>

                <p className="mb-6">
                  <strong>{t('terms.content.facial_recognition.label')}</strong> {t('terms.content.facial_recognition.text')}
                </p>

                <div className="mb-6 bg-ant-bg-elevated p-4 rounded border border-ant-border">
                  <p className="font-semibold text-ant-text mb-2">{t('terms.content.retention.title')}</p>
                  <p className="mb-3">
                    {t('terms.content.retention.policy_start')}
                    <strong>{t('terms.content.retention.policy_bold')}</strong> {t('terms.content.retention.policy_end')}
                  </p>
                  <p className="text-sm italic">
                    <strong>{t('terms.content.retention.exception.label')}</strong> {t('terms.content.retention.exception.text')}
                  </p>
                </div>

                <p className="mb-6">
                  <strong>{t('terms.content.responsibility.label')}</strong> {t('terms.content.responsibility.text')}
                </p>
              </div>

              {/* SUBSCRIPTIONS */}
              <div id="subscriptions-payments" className="scroll-mt-32 mt-20">
                <h2
                  className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>{t('terms.subscriptions.title')}</h2>

                <p className="mb-6">
                  <strong>{t('terms.subscriptions.billing.label')}</strong> {t('terms.subscriptions.billing.text')}
                </p>

                <p className="mb-6">
                  <strong>{t('terms.subscriptions.failure.label')}</strong> {t('terms.subscriptions.failure.text_start')}
                  <strong>{t('terms.subscriptions.failure.text_bold')}</strong>
                </p>

                <p className="mb-6">
                  <strong>{t('terms.subscriptions.taxes.label')}</strong> {t('terms.subscriptions.taxes.text')}
                </p>
              </div>

              {/* CANCELLATION */}
              <div id="cancellation-termination" className="scroll-mt-32 mt-20">
                <h2
                  className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>{t('terms.cancellation.title')}</h2>

                <p className="mb-6">
                  <strong>{t('terms.cancellation.policy.label')}</strong> {t('terms.cancellation.policy.text_start')}
                  <strong>{t('terms.cancellation.policy.text_bold')}</strong>
                </p>

                <p className="mb-6">
                  <strong>{t('terms.cancellation.export.label')}</strong> {t('terms.cancellation.export.text_start')}
                  <strong>{t('terms.cancellation.export.grace_period')}</strong> {t('terms.cancellation.export.text_mid')}
                  <strong>{t('terms.cancellation.export.text_bold_end')}</strong>
                </p>
              </div>

              {/* PROHIBITED USE */}
              <div id="prohibited-use" className="scroll-mt-32 mt-20">
                <h2
                  className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>{t('terms.prohibited.title')}</h2>
                <p className="mb-6">{t('terms.prohibited.intro')}</p>
                <ul className='flex flex-col gap-2 list-disc pl-10 mb-6'>
                  <li>{t('terms.prohibited.items.illegal')}</li>
                  <li>{t('terms.prohibited.items.reverse_engineer')}</li>
                  <li>{t('terms.prohibited.items.competitive')}</li>
                  <li>{t('terms.prohibited.items.scrape')}</li>
                  <li>{t('terms.prohibited.items.sharing')}</li>
                </ul>
              </div>

              {/* INTELLECTUAL PROPERTY */}
              <div id="intellectual-property" className="scroll-mt-32 mt-20">
                <h2 className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>{t('terms.ip.title')}</h2>
                <p className="mb-6">
                  <strong>{t('terms.ip.photon_ip.label')}</strong> {t('terms.ip.photon_ip.text')}
                </p>
                <p className="mb-6">
                  <strong>{t('terms.ip.feedback.label')}</strong> {t('terms.ip.feedback.text')}
                </p>
              </div>

              {/* DISCLAIMERS */}
              <div id="disclaimers-liability" className="scroll-mt-32 mt-20">
                <h2
                  className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>{t('terms.disclaimers.title')}</h2>

                <p className="mb-6">
                  <strong>{t('terms.disclaimers.as_is.label')}</strong> {t('terms.disclaimers.as_is.text')}
                </p>

                <p className="mb-6">
                  <strong>{t('terms.disclaimers.liability.label')}</strong> {t('terms.disclaimers.liability.text')}
                </p>

                <p className="mb-6">
                  <strong>{t('terms.disclaimers.exceptions.label')}</strong> {t('terms.disclaimers.exceptions.text')}
                </p>
              </div>

              {/* INDEMNIFICATION */}
              <div id="indemnification" className="scroll-mt-32 mt-20">
                <h2
                  className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>{t('terms.indemnification.title')}</h2>

                <p className="mb-6">{t('terms.indemnification.intro')}</p>
                <ul className='flex flex-col gap-2 list-disc pl-10 mb-6'>
                  <li>{t('terms.indemnification.items.usage')}</li>
                  <li>{t('terms.indemnification.items.violation_terms')}</li>
                  <li>{t('terms.indemnification.items.violation_rights')}</li>
                  <li>{t('terms.indemnification.items.claims')}</li>
                </ul>
              </div>

              {/* DISPUTE RESOLUTION */}
              <div id="dispute-resolution" className="scroll-mt-32 mt-20">
                <h2 className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>{t('terms.dispute.title')}</h2>

                <p className="mb-6">
                  <strong>{t('terms.dispute.arbitration.label')}</strong> {t('terms.dispute.arbitration.text')}
                </p>

                <p className="mb-6">
                  <strong>{t('terms.dispute.class_action.label')}</strong> {t('terms.dispute.class_action.text')}
                </p>

                <p className="mb-6">
                  <strong>{t('terms.dispute.opt_out.label')}</strong> {t('terms.dispute.opt_out.text_start')} <Link
                  href={`mailto:${process.env.NEXT_PUBLIC_EMAIL_SUPPORT_LEGAL}`}>{process.env.NEXT_PUBLIC_EMAIL_SUPPORT_LEGAL}</Link> {t('terms.dispute.opt_out.text_end')}
                </p>
              </div>

              {/* GENERAL */}
              <div id="general-provisions" className="scroll-mt-32 mt-20">
                <h2 className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>{t('terms.general.title')}</h2>

                <p className="mb-6">
                  <strong>{t('terms.general.governing.label')}</strong> {t('terms.general.governing.text')}
                </p>

                <p className="mb-6">
                  <strong>{t('terms.general.severability.label')}</strong> {t('terms.general.severability.text')}
                </p>

                <p className="mb-6">
                  <strong>{t('terms.general.contact.label')}</strong> {t('terms.general.contact.text_start')} <Link
                  href={`mailto:${process.env.NEXT_PUBLIC_EMAIL_SUPPORT_LEGAL}`}>{process.env.NEXT_PUBLIC_EMAIL_SUPPORT_LEGAL}</Link>.
                </p>
              </div>

            </article>
          </div>
        </div>
      </main>
    </div>
  )
}