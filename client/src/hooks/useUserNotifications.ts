import {useEffect} from 'react';
import {useUser} from '@/contexts/UserContext';
import {useEcho} from "@/contexts/EchoContext";
import Notification from "@/types/Notification";

export const useUserNotifications = (callback: (data: Notification) => void) => {
  const {echo} = useEcho();
  const {user} = useUser();

  useEffect(() => {
    if (!echo || !user?.id) return;
    const channelName = `App.Models.User.${user.id}`;
    const channel = echo.private(channelName);

    channel.notification(callback);

    return () => {
      channel.stopListening('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated');
    };
  }, [echo, user?.id]);
};