'use client'

import PhotonLogo from "@/components/ui/icons/PhotonLogo";
import {useScrollThreshold} from "@/hooks/useScrollThreshold";
import Link from "next/link";
import React from "react";
import {useScrollSpy} from "@/hooks/useScrollSpy";
import GuestHeader from "@/components/common/layout/GuestHeader";
import SidebarGuide from "@/components/features/guest/Legal/_components/SidebarGuide";
import {useT} from "@/i18n/client";

export default function PrivacyPolicy() {
  const isScrolled = useScrollThreshold();
  const {t} = useT('legal')


  const sections = [
    {id: "privacy-policy-overview", title: t('privacy.overview.title')},
    {id: "information-we-collect", title: t('privacy.collect.title')},
    {id: "how-we-use-information", title: t('privacy.use.title')},
    {id: "how-we-disclose", title: t('privacy.disclose.title')},
    {id: "how-we-store-and-secure", title: t('privacy.store.title')},
    {id: "how-long-we-keep", title: t('privacy.retain.title')},
    {id: "access-and-control", title: t('privacy.access.title')},
    {id: "children-privacy", title: t('privacy.children.title')},
    {id: "regional-disclosures", title: t('privacy.regional.title')},
    {id: "changes-to-policy", title: t('privacy.changes.title')},
    {id: "how-to-contact-us", title: t('privacy.contact.title')},
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
    <div className='h-[300vh]'>
      <GuestHeader/>

      <div
        className={
          `fixed left-0 w-full z-50 shadow-md h-18 flex items-center bg-ant-bg-elevated border-t border-t-ant-border
           transition-[top] duration-150 ease-out
           ${isScrolled ? 'top-0' : 'top-18'}`
        }>
        <div className="container mx-auto overflow-x-hidden">
          <div className="flex items-center">
            <div className={
              `transition-[width] duration-150 ease-out ${isScrolled ? "w-6 mr-3" : "w-0"} overflow-hidden`
            }>

              <PhotonLogo className={`w-6`}/>
            </div>

            <h1
              className={`font-semibold text-ant-text-sec transition-all duration-300 ${isScrolled ? 'text-xl' : 'text-2xl'}`}>Legal</h1>
          </div>
        </div>
      </div>

      <main className={`${isScrolled ? 'pt-18' : 'pt-36'}`}>
        <div className="container mx-auto pt-8">
          <div className="flex text-base text-ant-text-sec gap-2 px-8">
            <Link href='/legal' className=''>{t('legal_information')}</Link>
            /
            <Link href='/legal/privacy-policy' className=''>{t('privacy_policy')}</Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] mt-4 p-4 lg:p-8 relative">
            {/* GUIDE SIDEBAR */}
            <SidebarGuide title={t('privacy_policy')} sections={sections} handleClick={handleLinkClick}
                          activeId={activeId}/>


            <article className="text-base leading-6 max-w-2xl text-ant-text-sec">
              <h1 className='text-5xl font-medium text-ant-text mb-4'>{t('privacy.title')}</h1>

              <p className='text-lg text-ant-text-sec mb-6'><em>{t('privacy.effective_date')}</em></p>

              <p className='mb-6'>{t('privacy.intro.p1')}</p>

              <p className='mb-6'>
                {t('privacy.intro.p2_start')} <strong>{t('privacy.intro.p2_bold')}</strong>
              </p>

              {/* TABLE OF CONTENTS */}
              <div className="mb-6">
                <p className='mb-6'>{t('privacy.intro.toc_header')}</p>
                <ul className='flex flex-col gap-3 list-disc pl-10'>
                  {sections.map(section => (
                    <li key={section.id}>
                      <Link href={`#${section.id}`} onClick={e => handleLinkClick(e, section.id)}>
                        {section.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <p className='mb-6'>{t('privacy.intro.controller_processor')}</p>

              {/* OVERVIEW */}
              <div id="privacy-policy-overview" className="scroll-mt-50 mt-20">
                <h2
                  className='text-[22px] font-medium leading-1.5 mb-6 text-ant-text'>{t('privacy.overview.title')}</h2>
                <ul className='flex flex-col gap-3 list-disc pl-10'>
                  <li>{t('privacy.overview.point_1')}</li>
                  <li>{t('privacy.overview.point_2')}</li>
                  <li>{t('privacy.overview.point_3')}</li>
                  <li>{t('privacy.overview.point_4')}</li>
                </ul>
              </div>

              {/* INFORMATION WE COLLECT */}
              <div id="information-we-collect" className="scroll-mt-50 mt-20">
                <h2 className='text-[22px] font-medium leading-1.5 mb-6 text-ant-text'>{t('privacy.collect.title')}</h2>
                <p className='mb-6'>{t('privacy.collect.intro')}</p>

                <p className='mb-6'><strong>{t('privacy.collect.provided.header')}</strong></p>
                <p className='mb-6'>{t('privacy.collect.provided.sub_intro')}</p>

                <p className='mb-6'>
                  <strong>{t('privacy.collect.provided.account.label')}</strong> {t('privacy.collect.provided.account.text')}
                </p>

                <p className='mb-6'>
                  <strong>{t('privacy.collect.provided.third_party.label')}</strong> {t('privacy.collect.provided.third_party.text')}
                </p>
                <p className='mb-6'>{t('privacy.collect.provided.third_party_note')}</p>

                <p className='mb-6'>
                  <strong>{t('privacy.collect.provided.content.label')}</strong> {t('privacy.collect.provided.content.text')}
                </p>

                <p className='mb-6'>
                  <strong>{t('privacy.collect.provided.payment.label')}</strong> {t('privacy.collect.provided.payment.text')}
                </p>

                <p className='mb-6'><strong>{t('privacy.collect.automatic.header')}</strong></p>
                <p className="mb-6">{t('privacy.collect.automatic.intro')}</p>

                <p className='mb-6'>
                  <strong>{t('privacy.collect.automatic.usage.label')}</strong> {t('privacy.collect.automatic.usage.text')}
                </p>

                <p className='mb-6'>
                  <strong>{t('privacy.collect.automatic.device.label')}</strong> {t('privacy.collect.automatic.device.text')}
                </p>
                <p className="mb-6">{t('privacy.collect.automatic.location_note')}</p>

                <p className='mb-6'>
                  <strong>{t('privacy.collect.automatic.cookies.label')}</strong> {t('privacy.collect.automatic.cookies.text')}
                </p>
                <p>{t('privacy.collect.automatic.cookies_note')}</p>
              </div>

              {/* HOW WE USE */}
              <div id="how-we-use-information" className="scroll-mt-50 mt-20">
                <h2 className='text-[22px] font-medium leading-1.5 mb-6 text-ant-text'>{t('privacy.use.title')}</h2>
                <p className="mb-6">{t('privacy.use.intro')}</p>

                <p className='mb-6'>
                  <strong>{t('privacy.use.provide.label')}</strong> {t('privacy.use.provide.text')}
                </p>
                <p className='mb-6'>
                  <strong>{t('privacy.use.develop.label')}</strong> {t('privacy.use.develop.text')}
                </p>
                <p className='mb-6'>
                  <strong>{t('privacy.use.communicate.label')}</strong> {t('privacy.use.communicate.text')}
                </p>
                <p className='mb-6'>
                  <strong>{t('privacy.use.marketing.label')}</strong> {t('privacy.use.marketing.text')}
                </p>
                <p className='mb-6'>
                  <strong>{t('privacy.use.support.label')}</strong> {t('privacy.use.support.text')}
                </p>
                <p className='mb-6'>
                  <strong>{t('privacy.use.security.label')}</strong> {t('privacy.use.security.text')}
                </p>
                <p className='mb-6'>
                  <strong>{t('privacy.use.legal.label')}</strong> {t('privacy.use.legal.text')}
                </p>
                <p className='mb-6'>
                  <strong>{t('privacy.use.consent.label')}</strong> {t('privacy.use.consent.text')}
                </p>
                <p className='mb-6'>
                  <strong>{t('privacy.use.aggregate.label')}</strong> {t('privacy.use.aggregate.text')}
                </p>
              </div>

              {/* HOW WE DISCLOSE */}
              <div id="how-we-disclose" className="scroll-mt-50 mt-20">
                <h2
                  className='text-[22px] font-medium leading-1.5 mb-6 text-ant-text'>{t('privacy.disclose.title')}</h2>
                <p className="mb-6">{t('privacy.disclose.intro')}</p>

                <h3 className='text-lg font-bold mb-4 text-ant-text'>{t('privacy.disclose.third_parties.header')}</h3>
                <p className='mb-6'>{t('privacy.disclose.third_parties.intro')}</p>

                <p className='mb-6'>
                  <strong>{t('privacy.disclose.third_parties.providers.label')}</strong> {t('privacy.disclose.third_parties.providers.text')}
                </p>
                <p className='mb-6'>
                  <strong>{t('privacy.disclose.third_parties.services.label')}</strong> {t('privacy.disclose.third_parties.services.text')}
                </p>
                <p className='mb-6'>
                  <strong>{t('privacy.disclose.third_parties.links.label')}</strong> {t('privacy.disclose.third_parties.links.text')}
                </p>
                <p className='mb-6'>
                  <strong>{t('privacy.disclose.third_parties.consent.label')}</strong> {t('privacy.disclose.third_parties.consent.text')}
                </p>
                <p className='mb-6'>
                  <strong>{t('privacy.disclose.third_parties.legal.label')}</strong> {t('privacy.disclose.third_parties.legal.text')}
                </p>

                <h3 className='text-lg font-bold mb-4 text-ant-text'>{t('privacy.disclose.affiliates.header')}</h3>
                <p className='mb-6'>
                  <strong>{t('privacy.disclose.affiliates.entities.label')}</strong> {t('privacy.disclose.affiliates.entities.text')}
                </p>
                <p className='mb-6'>
                  <strong>{t('privacy.disclose.affiliates.transfers.label')}</strong> {t('privacy.disclose.affiliates.transfers.text')}
                </p>

                <h3 className='text-lg font-bold mb-4 text-ant-text'>{t('privacy.disclose.users.header')}</h3>
                <p className='mb-6'>
                  <strong>{t('privacy.disclose.users.managed.label')}</strong> {t('privacy.disclose.users.managed.text')}
                </p>
                <p className='mb-6'>
                  <strong>{t('privacy.disclose.users.public.label')}</strong> {t('privacy.disclose.users.public.text')}
                </p>
              </div>

              {/* STORAGE & SECURITY */}
              <div id="how-we-store-and-secure" className="scroll-mt-50 mt-20">
                <h2 className='text-[22px] font-medium leading-1.5 mb-6 text-ant-text'>{t('privacy.store.title')}</h2>
                <p className="mb-6">{t('privacy.store.p1')}</p>
                <p className='mb-6'>{t('privacy.store.p2')}</p>
                <p className='mb-6'>{t('privacy.store.p3')}</p>
              </div>

              {/* RETENTION */}
              <div id="how-long-we-keep" className="scroll-mt-50 mt-20">
                <h2 className='text-[22px] font-medium leading-1.5 mb-6 text-ant-text'>{t('privacy.retain.title')}</h2>
                <p className="mb-6">{t('privacy.retain.intro')}</p>

                <p className='mb-6'>
                  <strong>{t('privacy.retain.account.label')}</strong> {t('privacy.retain.account.text')}
                </p>
                <p className='mb-6'>
                  <strong>{t('privacy.retain.shared.label')}</strong> {t('privacy.retain.shared.text')}
                </p>
                <p className='mb-6'>
                  <strong>{t('privacy.retain.managed.label')}</strong> {t('privacy.retain.managed.text')}
                </p>
                <p className='mb-6'>
                  <strong>{t('privacy.retain.marketing.label')}</strong> {t('privacy.retain.marketing.text')}
                </p>
              </div>

              {/* ACCESS AND CONTROL */}
              <div id="access-and-control" className="scroll-mt-50 mt-20">
                <h2 className='text-[22px] font-medium leading-1.5 mb-6 text-ant-text'>{t('privacy.access.title')}</h2>

                <h3 className='text-lg font-bold mb-4 text-ant-text'>{t('privacy.access.rights.header')}</h3>
                <p className="mb-6">{t('privacy.access.rights.p1')}</p>
                <p className='mb-6'>{t('privacy.access.rights.p2')}</p>

                <h3 className='text-lg font-bold mb-4 text-ant-text'>{t('privacy.access.choices.header')}</h3>
                <p className='mb-6'>
                  <strong>{t('privacy.access.choices.update.label')}</strong> {t('privacy.access.choices.update.text')}
                </p>
                <p className='mb-6'>
                  <strong>{t('privacy.access.choices.delete.label')}</strong> {t('privacy.access.choices.delete.text')}
                </p>
                <p className='mb-6'>
                  <strong>{t('privacy.access.choices.opt_out.label')}</strong> {t('privacy.access.choices.opt_out.text')}
                </p>
                <p className='mb-6'>
                  <strong>{t('privacy.access.choices.cookies.label')}</strong> {t('privacy.access.choices.cookies.text')}
                </p>
                <p className='mb-6'>
                  <strong>{t('privacy.access.choices.portability.label')}</strong> {t('privacy.access.choices.portability.text')}
                </p>
              </div>

              {/* CHILDREN */}
              <div id="children-privacy" className="scroll-mt-50 mt-20">
                <h2
                  className='text-[22px] font-medium leading-1.5 mb-6 text-ant-text'>{t('privacy.children.title')}</h2>
                <p className="mb-6">
                  <strong>{t('privacy.children.usage.label')}</strong> {t('privacy.children.usage.text')}
                </p>
                <p className="mb-6">
                  <strong>{t('privacy.children.photos.label')}</strong> {t('privacy.children.photos.text')}
                </p>
                <p className="mb-6">{t('privacy.children.responsibility')}</p>
              </div>

              {/* REGIONAL */}
              <div id="regional-disclosures" className="scroll-mt-50 mt-20">
                <h2
                  className='text-[22px] font-medium leading-1.5 mb-6 text-ant-text'>{t('privacy.regional.title')}</h2>
                <p className="mb-6">{t('privacy.regional.intro')}</p>

                {/* BR */}
                <h3 className='text-lg font-bold mb-4 text-ant-text'>{t('privacy.regional.br.title')}</h3>
                <p className='mb-6'>{t('privacy.regional.br.p1')}</p>
                <p className='mb-6'>{t('privacy.regional.br.p2')}</p>

                {/* EU */}
                <h3 className='text-lg font-bold mb-4 text-ant-text'>{t('privacy.regional.eu.title')}</h3>
                <p className='mb-6'>
                  <strong>{t('privacy.regional.eu.basis.label')}</strong> {t('privacy.regional.eu.basis.text')}
                </p>
                <ul className='flex flex-col gap-3 list-disc pl-10 mb-6'>
                  <li>{t('privacy.regional.eu.list.item1')}</li>
                  <li>{t('privacy.regional.eu.list.item2')}</li>
                  <li>{t('privacy.regional.eu.list.item3')}</li>
                  <li>{t('privacy.regional.eu.list.item4')}</li>
                </ul>
                <p className='mb-6'>
                  <strong>{t('privacy.regional.eu.transfers.label')}</strong> {t('privacy.regional.eu.transfers.text')}
                </p>

                {/* USA */}
                <h3 className='text-lg font-bold mb-4 text-ant-text'>{t('privacy.regional.us.title')}</h3>
                <p className='mb-6'><strong>{t('privacy.regional.us.no_sell')}</strong></p>
                <p className='mb-6'>{t('privacy.regional.us.rights')}</p>
                <p className='mb-6'><strong>{t('privacy.regional.us.categories_header')}</strong></p>
                <ul className='flex flex-col gap-3 list-disc pl-10 mb-6'>
                  <li>
                    <strong>{t('privacy.regional.us.cat.identifiers.label')}</strong> {t('privacy.regional.us.cat.identifiers.text')}
                  </li>
                  <li>
                    <strong>{t('privacy.regional.us.cat.commercial.label')}</strong> {t('privacy.regional.us.cat.commercial.text')}
                  </li>
                  <li>
                    <strong>{t('privacy.regional.us.cat.internet.label')}</strong> {t('privacy.regional.us.cat.internet.text')}
                  </li>
                  <li>
                    <strong>{t('privacy.regional.us.cat.biometric.label')}</strong> {t('privacy.regional.us.cat.biometric.text')}
                  </li>
                </ul>
                <p className='mb-6'>{t('privacy.regional.us.contact')}</p>

                {/* BIOMETRIC NOTICE */}
                <h3 className='text-lg font-bold mb-4 text-ant-text'>{t('privacy.regional.biometric.title')}</h3>
                <p className='mb-6'>{t('privacy.regional.biometric.p1')}</p>
                <p className='mb-6'>{t('privacy.regional.biometric.p2')}</p>
              </div>

              {/* CHANGES */}
              <div id="changes-to-policy" className="scroll-mt-50 mt-20">
                <h2 className='text-[22px] font-medium leading-1.5 mb-6 text-ant-text'>{t('privacy.changes.title')}</h2>
                <p className="mb-6">{t('privacy.changes.p1')}</p>
                <p className="mb-6">{t('privacy.changes.p2')}</p>
                <p className="mb-6">{t('privacy.changes.p3')}</p>
              </div>

              {/* CONTACT */}
              <div id="how-to-contact-us" className="scroll-mt-50 mt-20">
                <h2 className='text-[22px] font-medium leading-1.5 mb-6 text-ant-text'>{t('privacy.contact.title')}</h2>
                <p className="mb-6">{t('privacy.contact.intro')}</p>

                <p className="mb-6">
                  <strong>Photon Cloud</strong><br/>
                  E-Mail: <Link
                  href={`mailto:${process.env.NEXT_PUBLIC_EMAIL_SUPPORT_PRIVACY}`}>{process.env.NEXT_PUBLIC_EMAIL_SUPPORT_PRIVACY}</Link>
                </p>

                <p className="mb-6">{t('privacy.contact.regions')}</p>
              </div>
            </article>
          </div>
        </div>
      </main>
    </div>
  )
}