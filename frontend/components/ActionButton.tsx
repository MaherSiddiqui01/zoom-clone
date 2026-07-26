"use client";

type Props = {
  label: string;
  color: string; // tailwind bg color class
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
};

import Link from "next/link";

export default function ActionButton({ label, color, icon, onClick, href }: Props) {
  const content = (
    <div
      className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl ${color} px-4 py-6 text-white shadow-sm transition hover:opacity-90`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return <button onClick={onClick} className="flex flex-1">{content}</button>;
}
