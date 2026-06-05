import React, { useState } from 'react';
import { Button } from '../Button';
import { NavItem } from './NavItem';
import { MobileMenuToggle } from './MobileMenuToggle';
import { NavigationBarProps } from './navigation.types';

const NavigationBar: React.FC<NavigationBarProps> = ({ user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      category: 'profile',
      items: [
        {
          href: '/dashboard',
          label: 'Overview',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          )
        },
        {
          href: '/dashboard/profile',
          label: 'Profile',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )
        }
      ]
    },
    {
      category: 'content',
      items: [
        {
          href: '/dashboard/oasisbios',
          label: 'OasisBios',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )
        },
        {
          href: '/dashboard/worlds',
          label: 'Worlds',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        },
        {
          href: '/dashboard/models',
          label: 'Models',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          )
        }
      ]
    },
    {
      category: 'system',
      items: [
        {
          href: '/dashboard/settings',
          label: 'Settings',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )
        }
      ]
    }
  ];

  return (
    <>
      <MobileMenuToggle isOpen={mobileMenuOpen} onToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      
      <div className={`
        lg:w-64 bg-muted/50 border-r border-border p-6 
        ${mobileMenuOpen ? 'fixed inset-0 z-40' : 'hidden lg:flex'}
        sticky top-0 h-screen flex flex-col overflow-y-auto transition-all duration-300
      `}>
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold">OasisBio</h1>
          <p className="text-muted-foreground text-sm">Dashboard</p>
          
          {/* User Information */}
          <div className="mt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center transition-transform duration-300 hover:scale-105">
              {user?.profile?.avatarUrl ? (
                <img 
                  src={user.profile.avatarUrl} 
                  alt={user?.name || 'User'} 
                  className="w-full h-full rounded-full object-cover transition-opacity duration-300"
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div>
              <p className="font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground">@{user?.profile?.username || 'user'}</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 space-y-6">
          {navItems.map((group, index) => (
            <div key={index} className="space-y-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                {group.category === 'profile' && 'Profile'}
                {group.category === 'identity' && 'Identity'}
                {group.category === 'content' && 'Content'}
                {group.category === 'system' && 'System'}
              </h3>
              {group.items.map((item, itemIndex) => (
                <NavItem
                  key={itemIndex}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  category={group.category}
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}
            </div>
          ))}
        </nav>
        
        <div className="mt-auto pt-6 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start transition-all duration-300 hover:bg-red-50 hover:text-red-600"
            onClick={() => {
              onLogout();
              setMobileMenuOpen(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}

export default NavigationBar;
