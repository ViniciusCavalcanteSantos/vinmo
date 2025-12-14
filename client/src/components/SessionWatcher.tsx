import {usePathname, useRouter} from "next/navigation";
import {useEffect} from "react";
import {useNotification} from "@/contexts/NotificationContext";
import {useT} from "@/i18n/client";

export default function SessionWatcher() {
  const router = useRouter()
  const pathname = usePathname()
  const notification = useNotification()
  const {t} = useT()

  useEffect(() => {
    const handleSessionExpired = () => {
      if (pathname.startsWith('/app')) {
        document.cookie = 'logged_in=; Max-Age=0; Path=/; SameSite=Lax';
        router.push('/signin')
        notification.error({title: t('session_expired_message')})
      }
    }

    window.addEventListener('auth:session-expired', handleSessionExpired)
    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired)
    }
  }, [router, pathname])

  return null
}