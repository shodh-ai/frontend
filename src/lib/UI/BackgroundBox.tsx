import React, { ReactNode } from 'react';

interface BackgroundBoxProps {
  width?: string;
  children: ReactNode;
}

export default function BackgroundBox({ width = "w-full", children }: BackgroundBoxProps) {
  return (
    <div className={`border overflow-x-auto flex flex-col gap-2 border-[var(--Border-Secondary)] rounded-xl p-6 bg-black text-white ${width} max-lg:w-full`}>
      {children}
    </div>
  );
}
