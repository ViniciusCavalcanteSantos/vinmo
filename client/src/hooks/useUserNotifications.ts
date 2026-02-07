import { useEffect, useRef } from 'react';
import { useUser } from '@/contexts/UserContext';
import Notification from "@/types/Notification"; // Seu tipo existente

export const useUserNotifications = (callback: (data: Notification) => void) => {
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/stream`,
      { withCredentials: true }
    );

    eventSource.onopen = () => {
      // console.log('SSE Conectado');
    };

    eventSource.onmessage = (event) => {
      // Ignora pings ou mensagens vazias
      if (!event.data) return;

      try {
        // Converte o JSON do Redis para o objeto JS
        const data: Notification = JSON.parse(event.data);

        callback(data);
      } catch (error) {
        console.error('Erro ao processar notificação SSE:', error);
      }
    };

    eventSource.onerror = (error) => {
      if (eventSource.readyState === EventSource.CLOSED) {
        eventSource.close();
      }
    };

    return () => {
      eventSource.close();
    };
  }, [user?.id, callback]);
};