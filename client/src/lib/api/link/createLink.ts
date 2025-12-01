import apiFetch from "@/lib/apiFetch";

export async function createLink(
  values: any,
) {

  return apiFetch<{ link_id: string }>("/client/link", {
    method: "POST",
    body: JSON.stringify(values)
  });
}

