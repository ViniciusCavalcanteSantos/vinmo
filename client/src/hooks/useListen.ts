import {useEffect} from 'react';
import {useEcho} from "@/contexts/EchoContext";

type ChannelType = 'public' | 'private' | 'presence';

export const useListen = (
  channelName: string,
  eventName: string,
  callback: (data: any) => void,
  type: ChannelType = 'private'
) => {
  const {echo} = useEcho();

  useEffect(() => {
    if (!echo || !channelName) return;
    let channel;
    if (type === 'private') {
      channel = echo.private(channelName);
    } else if (type === 'presence') {
      channel = echo.join(channelName);
    } else {
      channel = echo.channel(channelName);
    }

    channel.listen(eventName, callback);

    return () => {
      channel.stopListening(eventName);
    };
  }, [echo, channelName, eventName, type]);
};