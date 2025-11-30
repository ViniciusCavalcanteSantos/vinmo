export function buildUrl(
  path: string,
  params?: Record<string, any>
) {
  if (!params) return path;

  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    query.append(key, String(value));
  });

  return `${path}?${query.toString()}`;
}
