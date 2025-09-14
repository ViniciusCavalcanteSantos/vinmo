import {PropsWithChildren} from "react";

export default function Layout({children}: PropsWithChildren) {

  return (
    <div className="h-full flex justify-center items-center">
      <div className="w-100 bg-neutral-900 p-6 rounded-sm">
        {children}
      </div>
    </div>
  );
}