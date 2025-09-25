import { Spin } from "antd";

export default function Fallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full w-full p-6 ">
      <Spin size="large" />
      <p className="text-gray-500 text-lg">Carregando...</p>
    </div>
  );
}