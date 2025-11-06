import User from "@/types/User";
import {useEffect, useState} from "react";
import {Button, Divider, Dropdown} from "antd";
import {LogoutOutlined, UserOutlined} from "@ant-design/icons";
import UserAvatar from "@/components/UserAvatar";
import Link from "next/link";
import {useT} from "@/i18n/client";
import {useUser} from "@/contexts/UserContext";

export default function UserAvatarDropdown({user}: { user: User | null }) {
  const {logout} = useUser();

  const [mounted, setMounted] = useState(false);
  const {t} = useT();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) {
    return null;
  }

  const handleLogout = () => {
    logout()
  }

  const dropdownContent = (
    <div className="bg-white shadow-2xl rounded-2xl flex flex-col gap-1">
      <div className="flex items-center gap-x-2 p-4 pb-0">
        <UserAvatar user={user} size={32} className=""/>
        <div>
          <div className="text-dark font-semibold">{user.name}</div>
          <div className="text-neutral-emphasis text-sm">{user.email}</div>
        </div>
      </div>

      <div className="p-2 flex flex-col">
        <div className="p-2">
          <Divider className="!m-0 !border-border-muted"/>
        </div>

        <Link href="/profile">
          <Button
            className="!p-2 w-full"
            type="text"
            icon={<UserOutlined/>}
            style={{justifyContent: "flex-start"}}
          >
            {t('profile')}
          </Button>
        </Link>

        <Link href="/signin" onClick={handleLogout}>
          <Button
            className="!p-2 w-full"
            type="text"
            icon={<LogoutOutlined/>}
            style={{justifyContent: "flex-start"}}
          >
            {t('logout')}
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      popupRender={() => dropdownContent}
    >
      <div className="inline-block cursor-pointer">
        <UserAvatar user={user}/>
      </div>
    </Dropdown>
  );
}

