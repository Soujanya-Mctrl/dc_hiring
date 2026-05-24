import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-black text-white flex items-center gap-3">
        <div className="w-[3px] h-5 bg-[#00C652] rounded-full" />
        {title}
      </h3>
      {subtitle && (
        <p className="text-[#737373] text-sm mt-1 ml-4">{subtitle}</p>
      )}
    </div>
  );
}
