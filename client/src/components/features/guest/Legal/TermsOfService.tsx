'use client'


import {useScrollThreshold} from "@/hooks/useScrollThreshold";
import Link from "next/link";
import {useScrollSpy} from "@/hooks/useScrollSpy";
import React from "react";
import SidebarGuide from "@/components/features/guest/Legal/_components/SidebarGuide";
import {useT} from "@/i18n/client";
import GuestHeader from "@/components/common/layout/GuestHeader";
import PhotonLogo from "@/components/ui/icons/PhotonLogo";

const sections = [
  {id: 'terms-overview', title: 'Terms of Service Overview'},
  {id: 'eligibility-accounts', title: 'Eligibility and Accounts'},
  {id: 'service-credits', title: 'Services and Credits Usage'},
  {id: 'storage-security', title: 'Storage, Security & Backups'},
  {id: 'content-biometrics', title: 'Content & Biometric Data'},
  {id: 'subscriptions-payments', title: 'Subscriptions and Payments'},
  {id: 'cancellation-termination', title: 'Cancellation & Data Export'},
  {id: 'prohibited-use', title: 'Prohibited Use'},
  {id: 'intellectual-property', title: 'Intellectual Property'},
  {id: 'disclaimers-liability', title: 'Disclaimers & Liability'},
  {id: 'indemnification', title: 'Indemnification'},
  {id: 'dispute-resolution', title: 'Dispute Resolution'},
  {id: 'general-provisions', title: 'General Provisions'},
];

export default function TermsOfService() {
  const isScrolled = useScrollThreshold();
  const sectionIds = sections.map(s => s.id)
  const {t} = useT('legal')

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

          <div className="grid grid-cols-[300px_1fr] mt-4 p-8">
            {/* SIDEBAR NAVIGATION */}
            <SidebarGuide title={t('terms_of_service')} sections={sections} handleClick={handleLinkClick}
                          activeId={activeId}/>

            {/* CONTENT AREA */}
            <article className="text-base leading-7 max-w-3xl pl-12 text-ant-text-sec">
              <h1 className='text-5xl font-medium text-ant-text mb-4'>Terms of Service</h1>

              <div id="terms-overview" className="scroll-mt-32 mt-10">
                <h2 className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>Terms of Service Overview</h2>
                <p className="mb-6"><em>Last Updated: October 7, 2025</em></p>

                <p className="mb-6">
                  These Photon Cloud Terms of Service (“Terms”) constitute a binding legal agreement between you
                  (“you”, “your”, or “Customer”) and Photon Cloud (“Photon”, “we”, “us”, or “our”). By accessing,
                  registering for, or using our Services, you agree to be bound by these Terms.
                </p>

                <p className="mb-6">
                  These Terms apply to your access to and use of the Photon platform, including our photo organization
                  tools, facial recognition features, storage services, client galleries, and any related applications,
                  APIs, or websites (collectively, the “Services”).
                </p>

                <p className="mb-6 p-4 bg-ant-bg-elevated rounded border border-ant-border">
                  <strong>ARBITRATION NOTICE:</strong> THESE TERMS CONTAIN A MANDATORY ARBITRATION PROVISION AND CLASS
                  ACTION WAIVER IN THE "DISPUTE RESOLUTION" SECTION. PLEASE REVIEW IT CAREFULLY, AS IT AFFECTS YOUR
                  LEGAL RIGHTS TO RESOLVE DISPUTES WITH PHOTON.
                </p>
              </div>

              <div id="eligibility-accounts" className="scroll-mt-32 mt-20">
                <h2 className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>Eligibility and Accounts</h2>

                <p className="mb-6"><strong>Professional Use:</strong> The Services are intended for professional use by
                  photographers, studios, and event organizers. By using the Services, you represent that you are at
                  least 18 years old and have the authority to enter into these Terms personally or on behalf of the
                  legal entity you represent.</p>

                <p className="mb-6"><strong>Account Security:</strong> You are responsible for safeguarding your account
                  credentials. You agree to notify us immediately of any unauthorized use of your account. Photon is not
                  liable for any loss or damage arising from your failure to protect your login information.</p>

                <p className="mb-6"><strong>Account Information:</strong> You agree to provide accurate, current, and
                  complete information during registration and to update such information to keep it accurate. We
                  reserve the right to suspend or terminate accounts that contain untruthful or incomplete information.
                </p>
              </div>

              <div id="service-credits" className="scroll-mt-32 mt-20">
                <h2 className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>Services and Credits Usage</h2>

                <p className="mb-6">
                  <strong>The Credit System:</strong> Certain features of the Services (e.g., facial recognition
                  indexing,
                  AI enhancements, storage allocation) consume "Credits" or "Usage Units". The specific cost in Credits
                  for each feature is detailed on our Pricing Page.
                </p>

                <p className="mb-6">
                  <strong>Allocations and Expiration:</strong> Subscription plans typically include a monthly allocation
                  of Credits. Unless explicitly stated in your plan, <strong>unused Credits expire at the end of each
                  billing cycle and do not roll over</strong>. Credits have no monetary value.
                </p>

                <p className="mb-6 bg-ant-bg-elevated p-4 rounded border border-ant-border">
                  <strong>Changes to Service:</strong> We may modify the Credit cost or features of the Service.
                  However, for any change that materially negatively impacts your usage (e.g., increasing credit costs),
                  <strong>we will provide at least 30 days' prior notice</strong> via email or in-app notification,
                  giving you the opportunity to cancel before the new terms apply.
                </p>
              </div>

              <div id="storage-security" className="scroll-mt-32 mt-20">
                <h2 className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>Storage, Security & Backups</h2>

                <p className="mb-6">
                  <strong>Cloud Infrastructure (AWS):</strong> The Services are hosted on industry-leading cloud
                  infrastructure
                  providers, primarily <strong>Amazon Web Services (AWS)</strong>. We utilize AWS S3 and redundant
                  technologies
                  designed to provide high durability and availability for your data.
                </p>

                <p className="mb-6">
                  <strong>Security Measures:</strong> We implement commercially reasonable technical and organizational
                  measures to protect your data, including encryption in transit and at rest. However, you acknowledge
                  that no system is impenetrable.
                </p>

                <div
                  className="mb-6 p-4 rounded border border-yellow-200/50 bg-yellow-50/50 dark:bg-yellow-900/10 dark:border-yellow-800/30">
                  <p className="font-semibold text-ant-text mb-2">YOUR RESPONSIBILITY FOR BACKUPS</p>
                  <p>
                    While we leverage AWS's durability, <strong>Photon is not an archival backup service</strong>.
                    Technical errors, account suspensions, payment failures, or catastrophic events could result in loss
                    of access to your data. You agree that you are solely responsible for maintaining independent copies
                    of your original photos (RAW/JPG) on your own local storage or separate backup systems.
                    Photon is not liable for any loss of Content.
                  </p>
                </div>
              </div>

              <div id="content-biometrics" className="scroll-mt-32 mt-20">
                <h2 className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>Content and Biometric Data</h2>

                <p className="mb-6"><strong>Ownership:</strong> You retain all rights and ownership of the photos,
                  images, and metadata ("Content") you upload. You grant Photon a worldwide, non-exclusive, royalty-free
                  license to host, store, resize, process, and display your Content solely as required to provide the
                  Services.</p>

                <p className="mb-6">
                  <strong>Facial Recognition & Biometrics:</strong> The Services use biometric technology to detect
                  and group faces. You acknowledge that this involves processing "Biometric Information" or "Biometric
                  Identifiers"
                  under applicable laws (such as BIPA, GDPR, and LGPD).
                </p>

                <div className="mb-6 bg-ant-bg-elevated p-4 rounded border border-ant-border">
                  <p className="font-semibold text-ant-text mb-2">Biometric Retention Policy</p>
                  <p className="mb-3">
                    Photon retains biometric identifiers only for as long as necessary to provide the Service.
                    All biometric data associated with your account is permanently destroyed <strong>within 30
                    days</strong>
                    of account termination or upon your explicit deletion of the source photos, whichever comes first.
                  </p>
                  <p className="text-sm italic">
                    <strong>Exception:</strong> We may retain such data for a longer period strictly if required by
                    applicable law, regulation, or valid legal process (e.g., a court order or litigation hold).
                    In such cases, data will be isolated and retained only until the legal requirement expires.
                  </p>
                </div>

                <p className="mb-6">
                  <strong>Your Responsibility:</strong> You represent that you have obtained explicit consent from
                  individuals depicted in your Content (or their guardians) to capture and process their biometric data.
                  You agree to indemnify Photon against any claims arising from your failure to obtain such consent.
                </p>
              </div>

              <div id="subscriptions-payments" className="scroll-mt-32 mt-20">
                <h2 className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>Subscriptions and Payments</h2>

                <p className="mb-6"><strong>Billing:</strong> You authorize Photon (and our third-party payment
                  processors) to charge your payment method for the applicable subscription fees and any overage charges
                  incurred. Fees are billed in advance on a recurring basis.</p>

                <p className="mb-6"><strong>Failure to Pay:</strong> If a payment fails or is past due, we may downgrade
                  your account to a free plan or suspend your access to the Services. <strong>Suspended accounts may be
                    subject to data deletion after a specific grace period (e.g., 30 days).</strong></p>

                <p className="mb-6"><strong>Taxes:</strong> Fees are exclusive of taxes. You are responsible for paying
                  all taxes, levies, or duties imposed by taxing authorities.</p>
              </div>

              <div id="cancellation-termination" className="scroll-mt-32 mt-20">
                <h2 className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>Cancellation & Data Export</h2>

                <p className="mb-6">
                  <strong>Cancellation:</strong> You may cancel your subscription at any time via account settings.
                  Cancellation will be effective at the end of the current billing cycle.
                  <strong>There are no refunds for partial months or unused credits.</strong>
                </p>

                <p className="mb-6">
                  <strong>Data Export Window:</strong> Upon cancellation or expiration of a paid subscription, Photon
                  may
                  provide a limited <strong>30-day grace period</strong> during which you may access your account in a
                  "read-only" mode solely to export your Content. After this period, <strong>Photon reserves the right
                  to permanently delete all your Content to free up storage space.</strong>
                </p>
              </div>

              <div id="prohibited-use" className="scroll-mt-32 mt-20">
                <h2 className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>Prohibited Use</h2>
                <p className="mb-6">You agree not to use the Services to:</p>
                <ul className='flex flex-col gap-2 list-disc pl-10 mb-6'>
                  <li>Upload content that is illegal, defamatory, pornographic, or violates intellectual property
                    rights.
                  </li>
                  <li>Attempt to reverse engineer, decompile, or extract source code from the Services.</li>
                  <li>Use the Services to build a competitive product or service.</li>
                  <li>Scrape, crawl, or access the Services via unauthorized automated means.</li>
                  <li>Share your account credentials with multiple users (account sharing) unless explicitly permitted
                    by your plan.
                  </li>
                </ul>
              </div>

              <div id="intellectual-property" className="scroll-mt-32 mt-20">
                <h2 className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>Intellectual Property</h2>
                <p className="mb-6">
                  <strong>Photon IP:</strong> All rights, title, and interest in and to the Services (excluding your
                  Content),
                  including all software, technology, code, user interfaces, trademarks, and logos, are and will remain
                  the exclusive property of Photon Cloud.
                </p>
                <p className="mb-6">
                  <strong>Feedback:</strong> If you provide feedback or suggestions regarding the Services, we may use
                  such feedback without obligation or compensation to you.
                </p>
              </div>

              <div id="disclaimers-liability" className="scroll-mt-32 mt-20">
                <h2 className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>Disclaimers and Limitation of
                  Liability</h2>

                <p className="mb-6"><strong>"AS IS" WARRANTY:</strong> THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS
                  AVAILABLE" BASIS. PHOTON EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING WARRANTIES OF MERCHANTABILITY,
                  FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE
                  UNINTERRUPTED, ERROR-FREE, OR THAT FACIAL RECOGNITION RESULTS WILL BE 100% ACCURATE.</p>

                <p className="mb-6"><strong>LIMITATION OF LIABILITY:</strong> TO THE MAXIMUM EXTENT PERMITTED BY LAW,
                  PHOTON SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
                  OR ANY LOSS OF PROFITS, DATA, USE, OR GOODWILL. IN NO EVENT SHALL PHOTON'S AGGREGATE LIABILITY FOR ALL
                  CLAIMS EXCEED THE GREATER OF ONE HUNDRED U.S. DOLLARS ($100) OR THE AMOUNT YOU PAID PHOTON IN THE
                  TWELVE (12) MONTHS PRECEDING THE CLAIM.</p>

                <p className="mb-6"><strong>EXCEPTIONS:</strong> NOTHING IN THESE TERMS LIMITS OR EXCLUDES LIABILITY
                  FOR: (A) DEATH OR PERSONAL INJURY CAUSED BY NEGLIGENCE; (B) FRAUD OR FRAUDULENT MISREPRESENTATION; OR
                  (C) ANY OTHER LIABILITY THAT CANNOT BE EXCLUDED OR LIMITED BY APPLICABLE LAW (INCLUDING GROSS
                  NEGLIGENCE OR WILLFUL MISCONDUCT).</p>
              </div>

              <div id="indemnification" className="scroll-mt-32 mt-20">
                <h2 className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>Indemnification</h2>

                <p className="mb-6">
                  You agree to defend, indemnify, and hold harmless Photon Cloud, its officers, directors, employees,
                  and agents from and against any claims, damages, obligations, losses, liabilities, costs, and expenses
                  (including attorney's fees) arising from:
                </p>
                <ul className='flex flex-col gap-2 list-disc pl-10 mb-6'>
                  <li>Your use of and access to the Services;</li>
                  <li>Your violation of any term of these Terms;</li>
                  <li>Your violation of any third-party right, including copyright, property, or privacy rights;</li>
                  <li>Any claim that your Content or your use of facial recognition caused damage to a third party
                    (including claims related to lack of consent).
                  </li>
                </ul>
              </div>

              <div id="dispute-resolution" className="scroll-mt-32 mt-20">
                <h2 className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>Dispute Resolution</h2>

                <p className="mb-6">
                  <strong>Arbitration:</strong> Any dispute arising from these Terms shall be resolved by binding
                  arbitration
                  administered by a recognized arbitration body, except for disputes qualifying for small claims court.
                </p>

                <p className="mb-6">
                  <strong>Class Action Waiver:</strong> YOU WAIVE ANY RIGHT TO PARTICIPATE IN A CLASS-ACTION LAWSUIT
                  OR CLASS-WIDE ARBITRATION. DISPUTES SHALL BE RESOLVED ON AN INDIVIDUAL BASIS ONLY.
                </p>

                <p className="mb-6">
                  <strong>30-Day Opt-Out:</strong> You have the right to opt out of the arbitration and class action
                  waiver provisions
                  by sending written notice of your decision to <Link
                  href={`mailto:${process.env.NEXT_PUBLIC_EMAIL_SUPPORT_LEGAL}`}>{process.env.NEXT_PUBLIC_EMAIL_SUPPORT_LEGAL}
                </Link> within
                  30 days of first accepting these Terms.
                </p>
              </div>

              <div id="general-provisions" className="scroll-mt-32 mt-20">
                <h2 className='text-[22px] font-medium text-ant-text leading-1.5 mb-6'>General Provisions</h2>

                <p className="mb-6">
                  <strong>Governing Law:</strong> These Terms are governed by the laws of the Federative Republic of
                  Brazil.
                  You agree to submit to the exclusive jurisdiction of the courts located in Brazil to resolve any legal
                  matter
                  arising from these Terms, unless mandatory local law in your country requires otherwise.
                </p>

                <p className="mb-6"><strong>Severability:</strong> If any provision of these Terms is found to be
                  invalid or unenforceable, that provision shall be enforced to the maximum extent possible, and the
                  remaining provisions shall remain in full force.</p>

                <p className="mb-6"><strong>Contact:</strong> Questions about these Terms? Contact us at <Link
                  href={`mailto:${process.env.NEXT_PUBLIC_EMAIL_SUPPORT_LEGAL}`}>{process.env.NEXT_PUBLIC_EMAIL_SUPPORT_LEGAL}
                </Link>.
                </p>
              </div>

            </article>
          </div>
        </div>
      </main>
    </div>
  )
}