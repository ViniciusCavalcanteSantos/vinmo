'use client';

import {Avatar, Button, Divider, Space} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import Link from 'next/link';
import {useWindowScroll} from "react-use";
import Logo from "@/components/Logo";
import {useT} from "@/i18n/client";
import {useRouter} from "next/navigation";

const LandingPageHeader = () => {
  const {t} = useT()
  const {y} = useWindowScroll();
  const isScrolled = y > 50;
  const isAuthenticated = false
  const router = useRouter();

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out px-4 md:px-8 bg-white shadow-md h-16 ${
        isScrolled
          ? ''
          : ''
      }`}
    >
      <div className="container mx-auto flex justify-between items-center h-full">
        <div className="text-xl font-bold">
          <Link
            href="/"
            className={`transition-colors duration-300 ${
              isScrolled ? 'text-gray-800' : 'text-white'
            }`}
          >
            <div className="flex items-center justify-center text-4xl text-ant-text-sec font-normal">
              <Logo width={40}/>
              <h1 className="-translate-x-1"><span className="sr-only">V</span><span
                className='hidden xs:inline-flex'>inmo</span></h1>
            </div>
          </Link>
        </div>

        <div>
          {isAuthenticated ? (
            <Avatar size="large" icon={<UserOutlined/>} className="cursor-pointer"/>
          ) : (
            <Space>
              <Button onClick={() => router.push('signup')}>{t('login.sign_up')}</Button>

              <Divider type="vertical" style={{height: '2rem'}}/>

              <Link href="/signin"
                    className='text-primary font-semibold py-2 px-3 hover:bg-[#091E420F] text-base transition-colors duration-200'>{t('login.sign_in')}</Link>
            </Space>
          )}
        </div>
      </div>
    </header>
  );
};

export default LandingPageHeader;