import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItemProps } from './navigation.types';

const categoryColor: Record<string, string> = {
  profile: 'text-blue-500',
  identity: 'text-purple-500',
  content: 'text-green-500',
  system: 'text-orange-500',
};

export function NavItem({ href, label, icon, active: activeProp, onClick, category }: NavItemProps) {
  const pathname = usePathname();
  const isActive = activeProp ?? (
    pathname === href || pathname?.startsWith(href + '/')
  );

  const baseClasses = `
    w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
    transition-colors duration-150
    ${isActive
      ? 'bg-primary/10 text-primary'
      : 'text-foreground hover:bg-muted'
    }
  `.trim().replace(/\s+/g, ' ');

  return (
    <Link href={href} onClick={onClick} passHref>
      <span className={baseClasses}>
        <span className={`${categoryColor[category ?? ''] ?? 'text-foreground'} flex-shrink-0`}>
          {icon}
        </span>
        <span className={isActive ? 'font-semibold' : ''}>{label}</span>
      </span>
    </Link>
  );
}
