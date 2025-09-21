import { createContext, useContext } from 'react';
import { notification } from 'antd';

type NotificationType = ReturnType<typeof notification.useNotification>[0];
const NotificationContext = createContext<NotificationType>(notification);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [api, contextHolder] = notification.useNotification();

  return (
    <NotificationContext.Provider value={api}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
