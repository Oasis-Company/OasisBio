import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavItem } from './NavItem';

describe('NavItem', () => {
  const defaultProps = {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <span>📊</span>,
  };

  it('should render NavItem with default props', () => {
    render(<NavItem {...defaultProps} />);
    
    const navItem = screen.getByRole('link');
    expect(navItem).toBeInTheDocument();
    expect(navItem).toHaveAttribute('href', '/dashboard');
    expect(navItem).toHaveTextContent('Dashboard');
  });

  it('should render NavItem with active state', () => {
    render(<NavItem {...defaultProps} active />);
    
    const navItem = screen.getByRole('link');
    expect(navItem).toHaveClass('bg-primary/10 text-primary');
  });

  it('should render NavItem with category styling', () => {
    render(<NavItem {...defaultProps} category="profile" />);
    
    const iconContainer = screen.getByText('📊').parentElement;
    expect(iconContainer).toHaveClass('text-blue-500');
  });

  it('should call onClick handler when clicked', () => {
    const onClick = jest.fn();
    render(<NavItem {...defaultProps} onClick={onClick} />);
    
    const navItem = screen.getByRole('link');
    fireEvent.click(navItem);
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should have correct styling for different categories', () => {
    const categories = [
      { category: 'profile', expectedClass: 'text-blue-500' },
      { category: 'identity', expectedClass: 'text-purple-500' },
      { category: 'content', expectedClass: 'text-green-500' },
      { category: 'system', expectedClass: 'text-orange-500' },
    ];

    categories.forEach(({ category, expectedClass }) => {
      const { container } = render(<NavItem {...defaultProps} category={category} />);
      const iconContainer = container.querySelector('.mr-2');
      expect(iconContainer).toHaveClass(expectedClass);
    });
  });
});
