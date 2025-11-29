import {headers} from "next/headers";
import {redirect} from "next/navigation";

export default async function enforcePath(targetPath: string) {
  const headersList = await headers();

  const currentPath = headersList.get('x-pathname');
  if (!currentPath) return;
  if (currentPath === targetPath || currentPath.endsWith(targetPath)) return;
  redirect(targetPath);
}