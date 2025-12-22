import React from "react";
import Link from "next/link";

interface SidebarGuide {
  title: string,
  sections: { id: string, title: string }[]
  handleClick: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void
  activeId?: string | number
}

export default function SidebarGuide({title, sections, handleClick, activeId}: SidebarGuide) {

  return (
    <aside className="">
      <div className={`sticky top-25`}>
        <Link href='' className='!text-ant-text hover:!text-ant-text-sec font-semibold text-base'>{title}</Link>

        <div className="flex flex-col pl-8 mt-4 gap-4">

          {sections.map(section => (
            <div key={section.id} className='relative flex items-center'>
                      <span
                        className={`absolute -left-3.5 w-[5px] h-[5px] rounded-full bg-ant-text-ter transition-opacity duration-300 
                          ${activeId === section.id ? 'opacity-100' : 'opacity-0'}
                        `}
                      />

              <Link
                href={`#${section.id}`}
                className='!text-ant-text-sec hover:!text-ant-text-ter'
                onClick={(e) => handleClick(e, section.id)}
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