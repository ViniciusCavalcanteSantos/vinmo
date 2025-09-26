import {useLocalStorage} from "react-use";
import User from "@/types/User";

export default function useUser(): User {
  return (useLocalStorage('user')[0]) as User ?? undefined;
}