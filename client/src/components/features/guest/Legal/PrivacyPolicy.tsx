'use client'

import PhotonLogo from "@/components/ui/icons/PhotonLogo";
import {useScrollThreshold} from "@/hooks/useScrollThreshold";
import Link from "next/link";
import React from "react";
import {useScrollSpy} from "@/hooks/useScrollSpy";
import GuestHeader from "@/components/common/layout/GuestHeader";

const sections = [
  {id: 'privacy-policy-overview', title: 'Privacy policy overview'},
  {id: 'information-we-collect', title: 'Information we collect'},
  {id: 'how-we-use-information', title: 'How we use information'},
  {id: 'how-we-disclose', title: 'How we disclose information'},
  {id: 'how-we-store-and-secure', title: 'How we store and secure information'},
  {id: 'how-long-we-keep', title: 'How long we keep information'},
  {id: 'access-and-control', title: 'Access and control your information'},
  {id: 'children-privacy', title: 'Our policy towards children'},
  {id: 'regional-disclosures', title: 'Regional disclosures'},
  {id: 'changes-to-policy', title: 'Changes to our privacy policy'},
  {id: 'how-to-contact-us', title: 'How to contact us'},
];

export default function PrivacyPolicy() {
  const isScrolled = useScrollThreshold();
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
          <div className="flex text-base text-ant-text-sec gap-2">
            <Link href='/' className=''>Legal information</Link>
            /
            <Link href='/' className=''>Privacy Policy</Link>
          </div>

          <div className="grid grid-cols-[300px_1fr] mt-4 p-8">
            {/* GUIDE SIDEBAR */}
            <aside className="">
              <div className={`sticky top-25`}>
                <Link href='' className='!text-ant-text hover:!text-ant-text-sec font-semibold text-base'>Privacy
                  Policy</Link>

                <div className="flex flex-col pl-8 mt-4 gap-4">

                  {sections.map(section => (
                    <div key={section.id} className='relative flex items-center'>
                      <span
                        className={`absolute -left-3.5 w-[5px] h-[5px] rounded-full bg-ant-text-ter transition-opacity duration-300 
                          ${activeId === section.id ? 'opacity-100' : 'opacity-0'}
                        `}
                      />

                      <Link
                        href={`#${section.id}`}
                        className='!text-ant-text-sec hover:!text-ant-text-ter'
                        onClick={(e) => handleLinkClick(e, section.id)}
                      >
                        {section.title}
                      </Link>
                    </div>
                  ))}

                </div>
              </div>
            </aside>


            <article className="text-base  leading-6 max-w-2xl">
              <h1 className='text-5xl font-medium text-ant-text mb-4'>Privacy Policy</h1>

              <p className='text-lg text-ant-text-sec mb-6'><em>Effective starting: October 7, 2025</em></p>
              <p className='mb-6'>
                Your privacy matters to us. This Privacy Policy explains how Photon Cloud (“Photon”, “we”, “us”, or
                “our”) collects, uses, shares, and protects information when you use our products, services, websites,
                or otherwise interact with us. Photon provides cloud-based software and related services. In this
                Privacy Policy, we refer to all of
                our products, services, and websites collectively as the “Services.”
              </p>

              <p className='mb-6'>
                This privacy policy also explains your choices surrounding how we use information about you, which
                includes how you can object to certain uses of information about you and how you can access and update
                certain information about you. <strong>
                If you do not agree with this privacy policy, do not access or use our
                Services or interact with any other aspect of our business.
              </strong>
              </p>

              <div className="mb-6">
                <p className='mb-6'>
                  This privacy policy is intended to help you understand:
                </p>

                <ul className='flex flex-col gap-3 list-disc pl-10'>
                  {sections.map(section => {
                    return (
                      <li key={section.id}>
                        <Link
                          href={`#${section.id}`}
                          onClick={e => handleLinkClick(e, section.id)}
                        >
                          {section.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <p className='mb-6'>
                This Privacy Policy describes how Photon handles personal information when we act as a data controller,
                meaning we determine how and why personal information is processed. In some cases, Photon processes
                personal information on behalf of our customers, such as when our
                Services are used by an organization to manage its own data or users. In these situations, Photon acts
                as a data processor or service provider, and the customer is the data controller. The customer is
                responsible for managing user accounts, configuring the Services, and determining how personal
                information is used. When Photon processes personal information on behalf of a customer, we do so
                according to that
                customer’s instructions and applicable data protection agreements. Photon is not responsible for the
                privacy or security practices of our customers, which may differ from those described in this Privacy
                Policy. If you have questions about how your personal information is used in this context, or wish to
                exercise your rights, please contact the organization that provided you access to the Services directly.
              </p>

              <div id="privacy-policy-overview" className="scroll-mt-50 mt-20">
                <h2 className='text-[22px] font-medium leading-1.5 mb-6'>Privacy policy overview</h2>

                <div className="">
                  <ul className='flex flex-col gap-3 list-disc pl-10'>
                    <li>
                      Photon collects information directly from you when you create an account or use our Services,
                      automatically through your interaction with the Services, and, in limited cases, from third-party
                      tools or services you choose to connect with Photon.
                    </li>
                    <li>
                      We use information to operate, maintain, and improve the Services, personalize your experience,
                      communicate with you, provide customer support, ensure security and reliability, and, where
                      permitted, for marketing and product development purposes.
                    </li>
                    <li>
                      We may share information with trusted service providers that help us operate the Services, comply
                      with legal obligations, protect our rights, or carry out business operations. Information may also
                      be shared with other users when this is a natural part of how the Services work, or with your
                      consent.
                    </li>
                    <li>
                      If you have questions, concerns, or requests related to privacy or this policy, you can contact
                      Photon using the details provided in the “How to contact us” section.
                    </li>
                  </ul>
                </div>
              </div>

              <div id="information-we-collect" className="scroll-mt-50 mt-20">
                <h2 className='text-[22px] font-medium leading-1.5 mb-6'>Information we collect</h2>

                <p className='mb-6'>
                  We collect information about you when you provide it directly to us, when you use our Services, and,
                  in some cases, from other sources, as described below.
                </p>

                <p className='mb-6'><strong>Information you provide to Photon</strong></p>

                <p className='mb-6'>
                  We collect information that you voluntarily provide when you interact with the Services or communicate
                  with us. This may include the following categories of information:
                </p>

                <p className='mb-6'><strong>Account and profile information: </strong>
                  We collect information when you create an account, sign up for the Services, configure your profile,
                  update account settings, set preferences, or make purchases. This information may include contact
                  details such as your name and email address, as well as billing-related information such as billing
                  address, company name, or other account identifiers. You may also choose to provide additional profile
                  information, such as a display name, profile photo, job title, or other details. We also store your
                  preferences and settings as configured within the Services.
                </p>

                <p className='mb-6'><strong>Third-party integrations and connected services: </strong>
                  You may provide information to Photon when you choose to connect or integrate third-party services
                  with our Services. For example, if you sign up for or log in to Photon using a third-party
                  authentication provider (such as Google), we may receive certain information from that provider, such
                  as your name and email address, as permitted by your account settings with that third party.
                </p>

                <p className='mb-6'>
                  The information we receive from third-party services depends on the permissions, settings, and privacy
                  policies of those services. We encourage you to review the privacy notices and settings of any
                  third-party services you connect to Photon to understand what information may be shared with us.
                </p>

                <p className='mb-6'><strong>Content you submit through the Services: </strong>
                  We also collect information and content that you submit through websites owned or operated by Photon.
                  This may include feedback, form submissions, messages, survey responses, or content shared through
                  interactive features, documentation pages, community areas, promotions, events, or similar activities
                  made available by Photon.
                </p>

                <p className='mb-6'><strong>Payment and billing information: </strong>
                  For paid Services, we collect billing and payment-related information. This may include the name and
                  contact details of a billing contact, billing address, and transaction-related details. Payment card
                  or financial information is typically collected and processed through secure third-party payment
                  processors in accordance with their applicable security standards.
                </p>

                <p className='mb-6'><strong>Information we collect automatically</strong></p>

                <p className="mb-6">
                  We automatically collect certain information when you access or use the Services, including when you
                  browse our websites or interact with features of the Services.
                </p>

                <p className='mb-6'><strong>Usage and interaction data: </strong>
                  We collect information about how you use the Services, including features accessed, actions taken,
                  pages viewed, links clicked, search queries, uploaded files (such as file names and sizes), and
                  interactions with other users or collaborators within the Services. This may also include information
                  about how teams or accounts use the Services, depending on account settings and permissions.
                </p>

                <p className='mb-6'><strong>Device and connection information: </strong>
                  We collect information about the devices you use to access the Services, such as your computer, mobile
                  device, or tablet. This may include operating system, browser type, device identifiers, IP address,
                  connection type, language settings, referring and exit URLs, and diagnostic or crash data.
                </p>

                <p className="mb-6">
                  We may use IP addresses or similar signals to estimate general location (such as country or region) in
                  order to provide, secure, and improve the Services. The amount and type of device information
                  collected may vary depending on your device and settings.
                </p>


                <p className='mb-6'><strong>Cookies and similar technologies: </strong>
                  Photon and our third-party partners may use cookies and similar tracking technologies (such as pixels,
                  web beacons, and local storage) to operate the Services, remember preferences, analyze usage, and
                  improve functionality.
                </p>

                <p>
                  Additional information about how we use cookies and similar technologies, as well as how you can
                  manage your preferences, is provided in our Cookies & Tracking Notice.
                </p>

              </div>

              <div id="how-we-use-information" className="scroll-mt-50 mt-20">
                <h2 className='text-[22px] font-medium leading-1.5 mb-6'>How we use information</h2>
                <p className="mb-6">
                  How we use the information we collect depends on the Services you use, how you use them, and the
                  preferences or settings you have configured. Photon uses information for the purposes described below.
                </p>

                <p className='mb-6'><strong>To provide the Services and personalize your experience: </strong>
                  We use information about you to operate and provide the Services, including to create and manage
                  accounts, process transactions, authenticate users, enable core functionality, and provide customer
                  support. This includes using information to operate, maintain, and improve the performance,
                  reliability,
                  and functionality of the Services. We may also use certain information, such as account attributes or
                  email domain information, to better understand organizational context and personalize content,
                  features,
                  or communications presented to you. Based on your interactions with the Services, enabled
                  integrations,
                  and usage patterns, we may tailor aspects of your experience, including recommendations, in-product
                  guidance, or communications related to the Services.
                </p>

                <p className='mb-6'><strong>To develop, improve, and evolve our Services: </strong>
                  Photon continuously works to improve the quality, security, and usefulness of its Services. We use
                  information, usage data, and feedback to understand how the Services are used, to identify trends,
                  usage
                  patterns, and areas for improvement, and to develop new products, features, and technologies.

                  This may include analyzing how features are used, how users interact with content or each other within
                  the Services, and how integrations or workflows perform. In some cases, we apply insights across
                  multiple Services to improve consistency, interoperability, or functionality. We may also test new
                  features or changes with a subset of users before making them generally available.
                </p>

                <p className='mb-6'><strong>To communicate with you about the Services: </strong>
                  We use your contact information to communicate with you regarding the Services. These communications
                  may
                  include transactional or administrative messages, such as account confirmations, billing notices,
                  subscription updates, security notifications, responses to inquiries, and customer support
                  communications.

                  We may also contact you to request feedback, provide information about product updates, or communicate
                  important changes related to the Services. Where applicable, you may be able to manage or opt out of
                  certain communications through your account settings or the communication itself.
                </p>

                <p className='mb-6'><strong>To conduct marketing and promotional activities: </strong>
                  We may use information about you and your use of the Services for marketing, research, analytics,
                  promotional activities, and business development. This may include sending communications about new
                  features, products, services, offers, surveys, newsletters, or events that may be relevant to you.

                  Marketing communications may be informed by your interactions with the Services, such as feature usage
                  or engagement with prior communications. Where permitted by law, we may also display Photon-related
                  advertising on third-party platforms. You can control or opt out of certain marketing communications
                  as described in the “How to access and control your information” section.
                </p>

                <p className='mb-6'><strong>To provide customer support: </strong>
                  We use information you provide through support channels to investigate, respond to, and resolve
                  technical issues or other requests. This may include analyzing logs, diagnostics, crash reports,
                  screenshots, or other materials provided to us.

                  Information may also be used to improve support processes, documentation, and the overall quality of
                  the Services, including for development, training, or fine-tuning of automated systems, machine
                  learning, or artificial intelligence features. Where applicable and with appropriate permissions, we
                  may involve trusted third-party specialists to assist in resolving support-related issues.
                </p>

                <p className='mb-6'><strong>To maintain safety, security, and integrity of the Services: </strong>
                  We use information to help verify accounts and activity, detect and prevent security incidents, abuse,
                  fraud, or unauthorized access, and to enforce applicable terms, policies, and legal requirements.

                  This may include monitoring activity, investigating suspicious behavior, and responding to potential
                  or actual security threats. These efforts may involve automated systems, including machine learning or
                  artificial intelligence tools, to enhance detection and response capabilities.
                </p>

                <p className='mb-6'><strong>To protect our legal rights and legitimate business interests: </strong>
                  We may use information where necessary to comply with applicable laws, regulations, legal processes,
                  or governmental requests, and to protect the rights, property, and safety of Photon, our users, or
                  others.

                  This includes using information in connection with legal claims, audits, compliance obligations,
                  dispute resolution, or corporate transactions such as mergers, acquisitions, reorganizations, or asset
                  transfers.
                </p>

                <p className='mb-6'><strong>With your consent: </strong>
                  We may use information about you for purposes not described above where you have given your explicit
                  consent. For example, with your permission, we may publish testimonials, case studies, or customer
                  stories to promote the Services.
                </p>

                <p className='mb-6'><strong>To aggregate or de-identify data: </strong>
                  We may aggregate or de-identify information collected through the Services so that it can no longer be
                  reasonably associated with an identifiable individual. Aggregated or de-identified data may be used
                  for a variety of purposes, including analytics, research, service improvement, and marketing.

                  Where information is de-identified, we maintain it in that form and do not attempt to re-identify it,
                  except as permitted by law.
                </p>
              </div>

              <div id="how-we-disclose" className="scroll-mt-50 mt-20">
                <h2 className='text-[22px] font-medium leading-1.5 mb-6'>How we disclose information</h2>

                <p className="mb-6">
                  Photon is built to empower your workflow, and sometimes that involves disclosing information
                  through the Services and to certain trusted third parties. We disclose the information we
                  collect in the following ways:
                </p>

                <h3 className='text-lg font-bold mb-4'>Disclosing to third parties</h3>

                <p className='mb-6'>
                  We disclose information to third parties that help us operate, provide, improve, integrate,
                  customize, support, and market our Services.
                </p>

                <p className='mb-6'><strong>Service Providers: </strong>
                  We work with third-party service providers for website and application development,
                  hosting, maintenance, backup, storage, virtual infrastructure, payment processing,
                  analysis, marketing, and other services. If a service provider needs to access
                  information about you to perform services on our behalf, they do so under strict
                  instructions from us, including security and confidentiality procedures designed
                  to protect your data.
                </p>

                <p className='mb-6'><strong>Third-Party Services: </strong>
                  You or your administrator may choose to add functionality by connecting third-party
                  services to Photon. Doing so may give these services access to your account and
                  information like your name and email address. The use of your data by these
                  third-party services is governed by their own privacy policies. We encourage you
                  to review them before connecting any third-party application. If you object to
                  your information being shared with these parties, please do not install or connect
                  these services.
                </p>

                <p className='mb-6'><strong>Links and Widgets: </strong>
                  The Services may include links to other websites or widgets (like social media
                  buttons) whose privacy practices may differ from ours. These features may collect
                  your IP address and which page you are visiting. Your interactions with these
                  features are governed by the privacy policy of the company providing them.
                </p>

                <p className='mb-6'><strong>With your consent: </strong>
                  We may disclose your information to third parties when you give us explicit
                  consent to do so, such as displaying personal testimonials or case studies
                  on our public website.
                </p>

                <p className='mb-6'><strong>Legal Compliance and Enforcement: </strong>
                  We may disclose your information to government authorities or law enforcement
                  if we believe it is reasonably necessary to (a) comply with applicable laws,
                  regulations, or legal processes; (b) enforce our agreements and policies;
                  (c) protect the security or integrity of our Services; or (d) protect Photon,
                  our customers, or the public from harm or illegal activities.
                </p>

                <h3 className='text-lg font-bold mb-4'>Disclosing to affiliated companies</h3>

                <p className='mb-6'><strong>Photon Cloud Entities: </strong>
                  We may disclose information to our corporate affiliates in order to operate,
                  maintain, and improve the Services. The protections of this privacy policy
                  apply to all information shared within our affiliated companies.
                </p>

                <p className='mb-6'><strong>Business Transfers: </strong>
                  In the event of a merger, sale of company assets, financing, or acquisition
                  of all or a portion of our business, your information may be disclosed or
                  transferred. You will be notified via email or a prominent notice if such
                  a transaction occurs.
                </p>

                <h3 className='text-lg font-bold mb-4'>Disclosing to other Service users</h3>

                <p className='mb-6'><strong>Managed accounts and administrators: </strong>
                  If you use an email address owned by your employer or organization to access
                  the Services, certain information (name, profile picture, contact info,
                  and past usage) may become accessible to that organization’s administrator
                  and other users sharing the same domain to facilitate management of the Services.
                </p>

                <p className='mb-6'><strong>Community and Public Forums: </strong>
                  Any information you contribute to our publicly accessible blogs, forums,
                  or documentation comments may be read and collected by the public. Your
                  posts may remain even after you terminate your account. We urge you to
                  be mindful of the sensitivity of any information you share in these areas.
                </p>
              </div>

              <div id="how-we-store-and-secure" className="scroll-mt-50 mt-20">
                <h2 className='text-[22px] font-medium leading-1.5 mb-6'>How we store and secure information</h2>

                <p className="mb-6">
                  We use industry-standard technical and organizational measures to secure the information
                  we store. This includes use of encryption, access controls, and secure data hosting
                  environments provided by world-class infrastructure partners.
                </p>

                <p className='mb-6'>
                  While we implement safeguards designed to protect your information, no security system
                  is impenetrable. Due to the inherent nature of the Internet, we cannot guarantee that
                  information, during transmission through the Internet or while stored on our systems or
                  otherwise in our care, is absolutely safe from intrusion by others.
                </p>

                <p className='mb-6'>
                  If you use our Services on behalf of an organization, your administrator may have
                  additional responsibilities for securing your use of the Services, such as configuring
                  security settings and managing access. We recommend that users take steps to protect
                  their own accounts, including using strong passwords and enabling any available
                  multi-factor authentication.
                </p>
              </div>

              <div id="how-long-we-keep" className="scroll-mt-50 mt-20">
                <h2 className='text-[22px] font-medium leading-1.5 mb-6'>How long we keep information</h2>

                <p className="mb-6">
                  How long we keep information we collect about you depends on the type of information,
                  the purposes for which it was collected, applicable legal or regulatory requirements,
                  and user expectations and preferences. After such time, we will either delete or
                  de-identify your information or, if this is not possible (for example, because the
                  information has been stored in backup archives), then we will securely store your
                  information and isolate it from any further use until deletion is possible.
                </p>

                <p className='mb-6'><strong>Account information: </strong>
                  We retain your account information for as long as your account is active and a
                  reasonable period thereafter in case you decide to re-activate the Services. We
                  also retain some of your information as necessary to comply with our legal obligations,
                  to resolve disputes, to enforce our agreements, to support business operations, and
                  to continue to develop and improve our Services. Where we retain information to
                  develop and improve our Services, we take steps to de-identify the information.
                </p>

                <p className='mb-6'><strong>Information you share on the Services: </strong>
                  If your account is deactivated or disabled, some of your information and the content
                  you have provided will remain in order to allow your team members or other users to
                  make full use of the Services. For example, we continue to display messages you sent
                  to the users that received them and continue to display content you provided.
                </p>

                <p className='mb-6'><strong>Managed accounts: </strong>
                  If the Services are made available to you through an organization (e.g., your employer),
                  we retain your information as long as required by the administrator of your account.
                  For more information, see "Managed accounts and administrators" within the
                  “How we disclose information” section.
                </p>

                <p className='mb-6'><strong>Marketing information: </strong>
                  If you have elected to receive marketing emails from us, we retain information about
                  your marketing preferences for a reasonable period of time from the date you last
                  expressed interest in our Services, such as when you last opened an email from us
                  or ceased using your Photon account. We retain information derived from cookies and
                  other tracking technologies for a reasonable period of time from the date such
                  information was created.
                </p>
              </div>

              <div id="access-and-control" className="scroll-mt-50 mt-20">
                <h2 className='text-[22px] font-medium leading-1.5 mb-6'>How to access and control your information</h2>

                <h3 className='text-lg font-bold mb-4'>Your Rights</h3>
                <p className="mb-6">
                  Where applicable under local law, you may have certain rights with respect to your personal
                  information. Depending on your jurisdiction, this may include the right to request access
                  to your data, correction of inaccuracies, deletion of your data, restriction of processing,
                  transfer of your data to another provider (portability), or to withdraw consent.
                </p>

                <p className='mb-6'>
                  We provide tools within the Services to help you exercise some of these rights (such as
                  updating your profile). For requests that cannot be fulfilled directly within your account
                  settings, you may contact us using the details in the “How to contact us” section.
                </p>

                <h3 className='text-lg font-bold mb-4'>Your Choices</h3>

                <p className='mb-6'><strong>Access and update your information: </strong>
                  Our Services give you the ability to access and update certain information about you from
                  within the Service, such as your profile settings. If you cannot update your information
                  yourself, please contact our support team for assistance.
                </p>

                <p className='mb-6'><strong>Delete your information: </strong>
                  You can remove certain content and profile information directly within the Services.
                  If you wish to delete your Photon account entirely, please contact us. Note that we may
                  need to retain certain information for record-keeping purposes, to complete transactions,
                  or to comply with our legal obligations.
                </p>

                <p className='mb-6'><strong>Opt out of communications: </strong>
                  You may opt out of receiving promotional communications from us by using the unsubscribe
                  link within each email or by contacting us. Even after you opt out of promotional messages,
                  you will continue to receive transactional messages regarding the Services (e.g., password
                  resets, billing confirmations).
                </p>

                <p className='mb-6'><strong>Cookie controls: </strong>
                  Most web browsers are set to accept cookies by default. If you prefer, you can usually
                  choose to set your browser to remove or reject browser cookies. Please note that if you
                  choose to remove or reject cookies, this could affect the availability and functionality
                  of our Services.
                </p>

                <p className='mb-6'><strong>Data portability: </strong>
                  Data portability is the ability to obtain some of your information in a format you can
                  move from one service provider to another. Should you request it, we will provide you
                  with an electronic file of your basic account information and the content you have
                  uploaded to the Services. Please contact us to initiate this request.
                </p>
              </div>

              <div id="children-privacy" className="scroll-mt-50 mt-20">
                <h2 className='text-[22px] font-medium leading-1.5 mb-6'>Our policy towards children</h2>

                <p className="mb-6">
                  <strong>Usage of the Services:</strong> Our Services are not intended for use by anyone under
                  the age of 16. We do not knowingly collect personal information directly from children under
                  16 to create accounts or sell services. If we become aware that a child under 16 has created
                  an account, we will delete it.
                </p>

                <p className="mb-6">
                  <strong>Photos of Children:</strong> We understand that our Customers (photographers and
                  organizers) may use the Services to process photos that include children (e.g., at school
                  events, birthday parties, or family sessions). In these cases, Photon acts solely as a data
                  processor.
                </p>

                <p className="mb-6">
                  The Customer is responsible for obtaining all necessary consents and authorizations from parents
                  or legal guardians required by applicable law to upload, store, and process images of minors
                  using our Services, including the use of facial recognition features. If you are a parent or
                  guardian and believe that a Customer has uploaded a photo of your child without your consent,
                  please contact the relevant Customer (photographer) directly, as they control the data.
                  If needed, you may also contact us for assistance.
                </p>
              </div>

              <div id="regional-disclosures" className="scroll-mt-50 mt-20">
                <h2 className='text-[22px] font-medium leading-1.5 mb-6'>Regional disclosures</h2>

                <p className="mb-6">
                  Depending on where you live, you may have specific privacy rights that apply to you.
                  The following privacy representations and disclosures are intended to supplement the
                  main privacy policy.
                </p>

                {/* --- BRAZIL (LGPD) --- */}
                <h3 className='text-lg font-bold mb-4'>Brazil (LGPD)</h3>
                <p className='mb-6'>
                  If you are a resident of Brazil, you have rights under the Lei Geral de Proteção de Dados (LGPD).
                  We process your data based on the legal grounds authorized by the LGPD, such as compliance
                  with a legal obligation, performance of a contract, and legitimate interests.
                </p>
                <p className='mb-6'>
                  You have the right to confirm the existence of processing, access your data, correct incomplete
                  or inaccurate data, anonymize or delete unnecessary data, and revoke consent. To exercise
                  any of these rights, please contact us.
                </p>

                {/* --- EUROPE (GDPR) --- */}
                <h3 className='text-lg font-bold mb-4'>European Economic Area and United Kingdom (GDPR)</h3>

                <p className='mb-6'><strong>Legal Basis for Processing: </strong>
                  If you are an individual in the EEA or UK, we collect and process information about you only
                  where we have legal bases for doing so under applicable EU laws. The legal bases depend on
                  the Services you use and how you use them. This means we collect and use your information only where:
                </p>
                <ul className='flex flex-col gap-3 list-disc pl-10 mb-6'>
                  <li>
                    We need it to provide you the Services, including operating the Services, provide customer
                    support and personalized features and to protect the safety and security of the Services;
                  </li>
                  <li>
                    It satisfies a legitimate interest (which is not overridden by your data protection interests),
                    such as for research and development, to market and promote the Services and to protect our
                    legal rights and interests;
                  </li>
                  <li>
                    You give us consent to do so for a specific purpose; or
                  </li>
                  <li>
                    We need to process your data to comply with a legal obligation.
                  </li>
                </ul>

                <p className='mb-6'><strong>International Transfers: </strong>
                  Photon operates globally. When we transfer information about you to our third-party service
                  providers (such as cloud hosting providers) outside the EEA or UK, we rely on appropriate
                  legal mechanisms, such as Standard Contractual Clauses, to ensure your data remains protected.
                </p>

                {/* --- USA (General) --- */}
                <h3 className='text-lg font-bold mb-4'>United States (State Privacy Laws)</h3>

                <p className='mb-6'>
                  <strong>We do not sell your personal information.</strong>
                </p>

                <p className='mb-6'>
                  If you are a resident of California, Virginia, Colorado, Connecticut, or Utah, you may have
                  additional rights regarding your personal information, including the right to know what
                  information we collect, the right to delete, and the right to correct information.
                </p>

                <p className='mb-6'>
                  <strong>Categories of Information Collected (Last 12 Months):</strong>
                </p>
                <ul className='flex flex-col gap-3 list-disc pl-10 mb-6'>
                  <li><strong>Identifiers:</strong> Name, email address, IP address, unique user identifiers.</li>
                  <li><strong>Commercial Information:</strong> Transaction records, purchase history.</li>
                  <li><strong>Internet Activity:</strong> Interaction with our website, pages viewed, features used.
                  </li>
                  <li><strong>Biometric Information:</strong> Facial geometry data (only processed when using specific
                    features of the Services and strictly for the purpose of photo organization).
                  </li>
                </ul>

                <p className='mb-6'>
                  To exercise your rights under US State Laws, please contact us. We will verify your request
                  using the email address associated with your account.
                </p>

                {/* --- BIOMETRIC NOTICE (Crucial for Photon) --- */}
                <h3 className='text-lg font-bold mb-4'>Notice Regarding Biometric Data</h3>
                <p className='mb-6'>
                  Photon includes features that use facial recognition technology to sort and organize photos.
                  This involves the processing of data that may be considered "biometric information" or "biometric
                  identifiers"
                  under certain laws (such as BIPA in Illinois or GDPR in Europe).
                </p>
                <p className='mb-6'>
                  We process this data solely to provide the specific functionality of the Service requested by the
                  Customer.
                  We do not sell, lease, or trade biometric data. We retain this data only for as long as necessary to
                  provide the Service or as required by law, after which it is permanently deleted.
                </p>
              </div>

              <div id="changes-to-policy" className="scroll-mt-50 mt-20">
                <h2 className='text-[22px] font-medium leading-1.5 mb-6'>Changes to our privacy policy</h2>

                <p className="mb-6">
                  We may change this privacy policy from time to time. We will post any privacy policy changes
                  on this page and, if the changes are significant, we will provide a more prominent notice
                  by adding a notice on the Services homepages, login screens, or by sending you an email
                  notification.
                </p>

                <p className="mb-6">
                  We encourage you to review our privacy policy whenever you use the Services to stay informed
                  about our information practices and the ways you can help protect your privacy.
                </p>

                <p className="mb-6">
                  If you disagree with any changes to this privacy policy, you will need to stop using the
                  Services and deactivate your account(s) as outlined in the “How to access and control your
                  information” section.
                </p>
              </div>

              <div id="how-to-contact-us" className="scroll-mt-50 mt-20">
                <h2 className='text-[22px] font-medium leading-1.5 mb-6'>How to contact us</h2>

                <p className="mb-6">
                  Your information is controlled by Photon Cloud. If you have questions or concerns about
                  how your information is handled, or if you wish to exercise your rights, please direct
                  your inquiry to us.
                </p>

                <p className="mb-6">
                  <strong>Photon Cloud</strong><br/>
                  E-Mail: <Link
                  href={`mailto:${process.env.NEXT_PUBLIC_EMAIL_SUPPORT_PRIVACY}`}>{process.env.NEXT_PUBLIC_EMAIL_SUPPORT_PRIVACY}</Link>
                </p>

                <p className="mb-6">
                  Individuals in the European Economic Area, United Kingdom, or Brazil may also contact
                  us via the email above regarding their specific rights under GDPR or LGPD.
                </p>
              </div>
            </article>
          </div>
        </div>
      </main>
    </div>
  )
}