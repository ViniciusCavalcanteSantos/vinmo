import {UserProvider} from "@/contexts/UserContext";
import User from "@/types/User";

export default function Providers({children, user}: { children: React.ReactNode, user: User }) {
  return (
    <UserProvider initialUser={user}>
      {children}
    </UserProvider>
  );
}
