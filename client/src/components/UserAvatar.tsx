"use client"

import User from "@/types/User";
import {Avatar, AvatarProps} from "antd";
import {useState,useEffect} from "react";

interface UserAvatarInterface extends AvatarProps{
  user?: User
}

export default function UserAvatar(props: UserAvatarInterface) {
  const { user, ...avatarProps } = props;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) {
    return <Avatar size="large" className="cursor-pointer uppercase" {...avatarProps} />;
  }

  const bgColor = stringToColor(user.name);
  return (
    <Avatar
      size="large"
      className="cursor-pointer uppercase"
      {...avatarProps}
      style={{ backgroundColor: user.picture ? undefined : bgColor }}
      src={user.picture}
    >
      {!user.picture && user.name[0]}
    </Avatar>
  );
}

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  // 360° no círculo HSL -> gera cores diferentes
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}