import React, { useState } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  const defaultProps = {
    id: 'test-input',
    name: 'test-input',
    placeholder: 'Enter text',
    value: '',
    onChange: jest.fn(),
  };

  it('should render Input with default props', () => {
    render(<Input {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'test-input');
    expect(input).toHaveAttribute('name', 'test-input');
  });

  it('should render Input with value', () => {
    render(<Input {...defaultProps} value="Test value" />);
    
    const input = screen.getByDisplayValue('Test value');
    expect(input).toBeInTheDocument();
  });

  it('should call onChange when input value changes', () => {
    const onChange = jest.fn();
    render(<Input {...defaultProps} onChange={onChange} />);
    
    const input = screen.getByPlaceholderText('Enter text');
    fireEvent.change(input, { target: { value: 'New value' } });
    
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should call onBlur when input loses focus', () => {
    const onBlur = jest.fn();
    render(<Input {...defaultProps} onBlur={onBlur} />);
    
    const input = screen.getByPlaceholderText('Enter text');
    fireEvent.blur(input);
    
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('should display error message when error is true', () => {
    render(<Input {...defaultProps} error errorMessage="This field is required" />);
    
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should display error message when validation fails', () => {
    const validate = (value: string) => value.length < 3 ? 'Value must be at least 3 characters' : null;
    render(<Input {...defaultProps} value="ab" validate={validate} />);
    
    const input = screen.getByPlaceholderText('Enter text');
    fireEvent.blur(input);
    
    const errorMessage = screen.getByText('Value must be at least 3 characters');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should not display error message when validation passes', () => {
    const validate = (value: string) => value.length < 3 ? 'Value must be at least 3 characters' : null;
    render(<Input {...defaultProps} value="abc" validate={validate} />);
    
    const input = screen.getByDisplayValue('abc');
    fireEvent.blur(input);
    
    const errorMessage = screen.queryByText('Value must be at least 3 characters');
    expect(errorMessage).not.toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input {...defaultProps} disabled />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeDisabled();
  });

  it('should have required attribute when required prop is true', () => {
    render(<Input {...defaultProps} required />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveAttribute('required');
  });

  it('should have min, max, and step attributes when provided', () => {
    render(<Input {...defaultProps} type="number" min="0" max="100" step="1" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
    expect(input).toHaveAttribute('step', '1');
  });

  it('should apply custom className', () => {
    render(<Input {...defaultProps} className="custom-class" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveClass('custom-class');
  });

  it('should handle debounced validation', async () => {
    jest.useFakeTimers();
    
    const validate = jest.fn((value: string) => value.length < 3 ? 'Value must be at least 3 characters' : null);
    // The Input component debounces on value prop changes, so we rerender with new value
    const { rerender } = render(<Input {...defaultProps} value="a" validate={validate} debounce={100} />);
    rerender(<Input {...defaultProps} value="ab" validate={validate} debounce={100} />);
    rerender(<Input {...defaultProps} value="abc" validate={validate} debounce={100} />);
    
    // Fast-forward time to trigger debounce — only the last value should be validated
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    expect(validate).toHaveBeenCalledWith('abc');
    expect(validate).toHaveBeenCalledTimes(1);
    
    jest.useRealTimers();
  });
});
