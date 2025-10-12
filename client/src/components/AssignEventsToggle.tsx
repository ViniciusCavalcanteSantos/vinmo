// components/AssignEventsToggle.tsx
import React from 'react';
import {Switch} from 'antd';
import {CalendarOutlined} from '@ant-design/icons';

// Não precisamos mais do 'styled-components'
// import styled from 'styled-components';

interface AssignEventsToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
}

const AssignEventsToggle: React.FC<AssignEventsToggleProps> = ({checked, onChange, title}) => {
  const handleClick = () => {
    onChange(!checked);
  };

  // Definimos as classes base que são sempre aplicadas
  const baseWrapperClasses = `
    flex items-center justify-between 
    px-4 py-3 
    border rounded-lg 
    cursor-pointer 
    transition-colors duration-200 ease-in-out
  `;

  // Definimos as classes que mudam com base no estado 'checked'
  const conditionalWrapperClasses = checked
    ? 'bg-blue-50 border-blue-400 hover:border-blue-500' // Estilos quando selecionado
    : 'bg-white border-gray-300 hover:border-blue-500';  // Estilos padrão

  const conditionalContentClasses = checked
    ? 'text-blue-700 font-semibold' // Estilos do texto quando selecionado
    : 'text-gray-800';             // Estilo do texto padrão

  return (
    // Juntamos as classes base e as condicionais
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