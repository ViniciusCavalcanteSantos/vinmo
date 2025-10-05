import {ReactNode} from "react";

interface PageHeaderProps {
  title: string;
  actions?: ReactNode;
}

export default function PageHeader({title, actions}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-dark">
        {title}
      </h1>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}