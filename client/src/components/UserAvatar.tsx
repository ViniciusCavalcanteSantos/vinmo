"use client"

import User from "@/types/User";
import {Avatar, AvatarProps} from "antd";
import {useEffect, useState} from "react";

const AVATAR_COLORS = [
  '#f56a00', // Orange
  '#7265e6', // Purple
  '#ffbf00', // Gold
  '#00a2ae', // Cyan
  '#1890ff', // Blue (Ant Default)
  '#52c41a', // Green
  '#eb2f96', // Magenta
  '#f5222d', // Red
];

interface UserAvatarInterface extends AvatarProps {
  user?: User
}

export default function UserAvatar(props: UserAvatarInterface) {
  const {user, ...avatarProps} = props;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) {
    return <Avatar size="large" className="cursor-pointer uppercase" {...avatarProps} />;
  }

  const bgColor = getStandardColor(user.name);
  return (
    <Avatar
      size="large"
      className="cursor-pointer uppercase !border-ant-fill"
      {...avatarProps}
      style={{backgroundColor: user.picture ? undefined : bgColor}}
      src={user.picture}
    >
      {!user.picture && user.name[0]}
    </Avatar>
  );
}

function getStandardColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}