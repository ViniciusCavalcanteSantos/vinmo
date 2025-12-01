import apiFetch from "@/lib/apiFetch";
import {RegisterLinkType} from "@/types/RegisterLinkType";

export async function fetchLink(linkId: string) {
  return apiFetch<{ linkInfo: RegisterLinkType }>(`/client/link/${linkId}`, {
    method: "GET"
  });
}