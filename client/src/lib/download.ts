export default function downloadFile(path: string) {
  const a = document.createElement('a');
  a.href = path;
  a.download = '';
  document.body.appendChild(a);
  a.click();
  a.remove();
}
