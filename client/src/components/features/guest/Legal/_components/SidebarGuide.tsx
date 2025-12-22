import React, {useRef, useState} from "react";
import Link from "next/link";
import {useClickAway} from "react-use";
import {RightOutlined} from "@ant-design/icons";
import {useScrollThreshold} from "@/hooks/useScrollThreshold";

interface SidebarGuide {
  title: string,
  sections: { id: string, title: string }[]
  handleClick: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void
  activeId?: string | number
}

export default function SidebarGuide({title, sections, handleClick, activeId}: SidebarGuide) {
  const [isOpen, setIsOpen] = useState(false);
  const isScrolled = useScrollThreshold();
  const ref = useRef(null);

  useClickAway(ref, () => {
    if (isOpen) setIsOpen(false);
  });

  return (
    <aside ref={ref} className={`
      fixed top-0 left-0 h-full z-40 w-[280px] bg-ant-bg-elevated lg:bg-transparent lg:shadow-none shadow-2xl
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      
      /* Desktop: Sticky, reset de posição e sombra */
      lg:sticky lg:block lg:h-auto lg:w-auto lg:bg-transparent lg:shadow-none lg:translate-x-0
      lg:top-28 lg:self-start
    `}>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          lg:hidden absolute -right-10 
          w-10 h-10 flex items-center justify-center
          bg-ant-bg-elevated border border-ant-border rounded-r-md shadow-md
          text-ant-text transition-colors hover:text-ant-primary cursor-pointer
          ${isScrolled ? 'top-24' : 'top-44'}
        `}
        aria-label="Toggle Sidebar"
      >
        <RightOutlined className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'translate-0'}`}/>
      </button>

      <div className="pt-24 p-6 lg:p-0 h-full overflow-y-auto lg:overflow-visible border-ant-border">
        <Link href='' className='!text-ant-text hover:!text-ant-text-sec font-semibold text-base block mb-4 lg:mb-0'>
          {title}
        </Link>

        <div className="flex flex-col pl-4 lg:pl-8 mt-4 gap-4">
          {sections.map(section => (
            <div key={section.id} className='relative flex items-center'>
              <span
                className={`absolute -left-3.5 w-[5px] h-[5px] rounded-full bg-ant-text-ter transition-opacity duration-300 
                  ${activeId === section.id ? 'opacity-100' : 'opacity-0'}
                `}
              />

              <Link
                href={`#${section.id}`}
                className={`!text-ant-text-sec hover:!text-ant-text-ter transition-colors ${activeId === section.id ? '!text-ant-text font-medium' : ''}`}
                onClick={(e) => {
                  handleClick(e, section.id);
                  setIsOpen(false);
                }}
              >
                {section.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}