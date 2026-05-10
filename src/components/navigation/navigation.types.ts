export interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
  category?: string;
}

export interface NavigationBarProps {
  user: any;
  onLogout: () => void;
}

export interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}
