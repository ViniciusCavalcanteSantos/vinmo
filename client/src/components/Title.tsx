import {Saira_Stencil_One} from "next/font/google";
import {ComponentPropsWithoutRef} from "react";

function LogoPart1({color, animated}: { color: string; animated: boolean }) {
  return (
    <svg
      className={`absolute w-full ${animated ? "logo-part1-animate" : ""}`}
      viewBox="0 0 607 463"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="translate(0,463) scale(0.1,-0.1)" fill={color} stroke="none">
        <path d="M980 4555 c0 -4 189 -404 977 -2065 286 -602 659 -1388 829 -1747
      169 -359 310 -650 312 -648 5 4 116 237 383 799 l209 439 -479 1011 c-263 556
      -576 1218 -696 1471 -119 253 -248 524 -285 603 l-69 142 -590 0 c-325 0 -591
      -2 -591 -5z"/>
      </g>
    </svg>
  );
}

function LogoPart2({color, animated}: { color: string; animated: boolean }) {
  return (
    <svg
      className={`absolute w-full ${animated ? "logo-part2-animate" : ""}`}
      viewBox="0 0 607 463"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="translate(0,463) scale(0.1,-0.1)" fill={color} stroke="none">
        <path d="M4037 4538 c-14 -11 -142 -278 -679 -1418 -36 -77 -48 -113 -45 -135
      3 -16 45 -113 94 -215 49 -102 176 -371 283 -597 106 -227 196 -413 200 -413
      4 0 37 64 75 143 37 78 310 655 607 1282 297 627 564 1191 593 1253 l54 112
      -583 0 c-450 0 -586 -3 -599 -12z"/>
      </g>
    </svg>
  );
}

export const sairaStencil = Saira_Stencil_One({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

export default function Title({className, ...props}: ComponentPropsWithoutRef<'p'>) {

  return (
    <>
      <p
        className={`
          text-transparent bg-clip-text font-extrabold bg-gradient-to-l from-ant-primary to-[#78ebff] p-2 tracking-wider
          ${className}
        `}
        {...props}
      >
        <span className={sairaStencil.className}>P</span>
        HOTON
      </p>
    </>
  );
}
