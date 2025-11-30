import downloadFile from "@/lib/download";

export function downloadImage(imageId: string) {
  downloadFile(`${process.env.NEXT_PUBLIC_API_URL}/api/images/${imageId}/download`)
}