import React from 'react';
import {Switch} from 'antd';
import {CalendarOutlined} from '@ant-design/icons';

interface AssignEventsToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
}

const AssignEventsToggle: React.FC<AssignEventsToggleProps> = ({checked, onChange, title}) => {
  const handleClick = () => {
    onChange(!checked);
  };

  // Definimos as classes-base que são sempre aplicadas
  const baseWrapperClasses = `
    flex items-center justify-between 
    px-4 py-3 
    border rounded-lg 
    cursor-pointer 
    transition-colors duration-200 ease-in-out
  `;

  const conditionalWrapperClasses = checked
    ? 'bg-blue-50 border-blue-400 hover:border-blue-500'
    : 'bg-white border-gray-300 hover:border-blue-500';

  const conditionalContentClasses = checked
    ? 'text-blue-700 font-semibold'
    : 'text-gray-800';

  return (
    <div className={`${baseWrapperClasses} ${conditionalWrapperClasses}`} onClick={handleClick}>
      <div className={`flex items-center gap-3 text-base ${conditionalContentClasses}`}>
        <CalendarOutlined/>
        <span>{title}</span>
      </div>
      <Switch checked={checked} onClick={(_, event) => event.stopPropagation()}/>
    </div>
  );
};

export default AssignEventsToggle;