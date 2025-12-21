'use client';

import {Button, Divider, Space} from 'antd';
import Link from 'next/link';
import {useWindowScroll} from "react-use";
import Title from "@/components/ui/Title";
import {useT} from "@/i18n/client";
import {useRouter} from "next/navigation";
import {useUser} from "@/contexts/UserContext";
import UserAvatarDropdown from "@/components/common/UserAvatarDropdown";

const GuestHeader = () => {
  const {t} = useT()
  const {y} = useWindowScroll();
  const isScrolled = y > 50;
  const {user} = useUser()
  const router = useRouter();

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out bg-ant-bg-elevated shadow-md   ${
        isScrolled
          ? ''
          : ''
      }`}
    >
      <div className="">
        <div className={`container mx-auto flex justify-between items-center h-18`}>
          <div className="text-xl font-bold">
            <Link
              href="/"
              className={`transition-colors duration-300 ${
                isScrolled ? 'text-gray-800' : 'text-white'
              }`}
            >
              <div className="flex items-center justify-center text-2xl text-ant-text-sec font-normal">
                <Title/>
              </div>
            </Link>
          </div>

          <div>
            {user ? (
              <UserAvatarDropdown user={user}/>
            ) : (
              <Space>
                <Button onClick={() => router.push('signup')}>{t('login.sign_up')}</Button>

                <Divider orientation="vertical" style={{height: '2rem'}}/>

                <Link href="/signin"
                      className='text-primary font-semibold py-2 px-3 hover:bg-[#091E420F] text-base transition-colors duration-200'>{t('login.sign_in')}</Link>
              </Space>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default GuestHeader;