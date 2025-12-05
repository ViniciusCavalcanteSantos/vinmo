import Pusher from 'pusher-js';
import Echo from "laravel-echo";
import axios from "axios";

(globalThis as any).Pusher = Pusher

export const createEcho = () => {
  const echoAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Accept': 'application/json',
    },
    withCredentials: true
  });

  return new Echo({
    broadcaster: 'reverb',
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
    wsPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT ?? '') ?? 8080,
    wssPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT ?? '') ?? 8080,
    forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'https') === 'https',

    enabledTransports: ['ws', 'wss'],

    authorizer: (channel: any, options: any) => {
      return {
        authorize: (socketId: string, callback: Function) => {
          echoAxios.post('/broadcasting/auth', {
            socket_id: socketId,
            channel_name: channel.name
          })
            .then(response => {
              callback(false, response.data);
            })
            .catch(error => {
              console.error('Erro na autenticação do Reverb:', error);
              callback(true, error);
            });
        }
      };
    }
  })
}