import {useMutation} from "@tanstack/react-query";
import {socialRedirect} from "@/lib/api/users/socialRedirect";

export function useSocialRedirect() {

  return useMutation({
    mutationFn: (socialMedia: string) => socialRedirect(socialMedia)
  })
}