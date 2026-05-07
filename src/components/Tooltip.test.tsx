import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Tooltip, HintIcon, FieldHint } from './Tooltip';
import { useTooltip } from './useTooltip';

// ─────────────────────────────────────────────
// Tooltip Component Tests
// ─────────────────────────────────────────────

describe('Tooltip', () => {
  it('should render children (the trigger element)', () => {
    render(
      <Tooltip content="Help text">
        <button>Hover me</button>
      </Tooltip>
    );

    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
  });

  it('should NOT show tooltip content by default', () => {
    render(
      <Tooltip content="Hidden help text">
        <button>Trigger</button>
      </Tooltip>
    );

    // The tooltip role="tooltip" should not be visible initially
    const tooltip = screen.queryByRole('tooltip');
    expect(tooltip).not.toBeInTheDocument();
  });

  it('should show tooltip on mouse enter after delay', async () => {
    jest.useFakeTimers();
    render(
      <Tooltip content="Visible help" delay={200}>
        <button>Hover me</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Hover me'));

    // Before delay — still hidden
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    // After delay — should appear
    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Visible help')).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('should hide tooltip on mouse leave', async () => {
    jest.useFakeTimers();
    render(
      <Tooltip content="Disappearing help">
        <button>Leave me</button>
      </Tooltip>
    );

    const trigger = screen.getByText('Leave me');

    // Show it
    fireEvent.mouseEnter(trigger);
    act(() => jest.advanceTimersByTime(250));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    // Hide it
    fireEvent.mouseLeave(trigger);
    act(() => jest.advanceTimersByTime(200));

    // The tooltip should be removed after exit animation
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it('should render string content as paragraph text', async () => {
    jest.useFakeTimers();
    render(
      <Tooltip content="Plain text hint">
        <button>Info</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Info'));
    act(() => jest.advanceTimersByTime(250));

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Plain text hint');

    jest.useRealTimers();
  });

  it('should render ReactNode content (e.g., bold text)', async () => {
    jest.useFakeTimers();
    render(
      <Tooltip content={<strong>Bold hint</strong>}>
        <button>Rich</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Rich'));
    act(() => jest.advanceTimersByTime(250));

    expect(screen.getByRole('tooltip')).toContainHTML('<strong>Bold hint</strong>');

    jest.useRealTimers();
  });

  it('should apply variant class for accent color', async () => {
    jest.useFakeTimers();
    render(
      <Tooltip content="Warning!" variant="warning">
        <button>Warn</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Warn'));
    act(() => jest.advanceTimersByTime(250));

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.className).toContain('border-l-amber-500');

    jest.useRealTimers();
  });

  it('should accept custom className', async () => {
    jest.useFakeTimers();
    render(
      <Tooltip content="Custom styled" className="text-lg font-bold">
        <button>Styled</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Styled'));
    act(() => jest.advanceTimersByTime(250));

    expect(screen.getByRole('tooltip').className).toContain('text-lg font-bold');

    jest.useRealTimers();
  });

  it('should have correct ARIA attributes when ariaLabel is provided', () => {
    render(
      <Tooltip content="Accessible hint" ariaLabel="Field description">
        <button>Accessible</button>
      </Tooltip>
    );

    const wrapper = screen.getByText('Accessible').closest('[aria-label]');
    expect(wrapper).toHaveAttribute('aria-label', 'Field description');
  });
});

// ─────────────────────────────────────────────
// HintIcon Tests
// ─────────────────────────────────────────────

describe('HintIcon', () => {
  it('should render a button with question-mark icon', () => {
    render(<HintIcon hint="Click for help" />);

    // Use getAllByLabelText since the nested structure may have multiple
    const buttons = screen.getAllByLabelText('More information');
    expect(buttons.length).toBeGreaterThan(0);
    // The inner button (the actual icon button)
    const btn = buttons.find(b => b.tagName === 'BUTTON');
    expect(btn).toBeInTheDocument();
    expect(btn!.querySelector('svg')).toBeInTheDocument();
  });

  it('should show tooltip with hint text on hover', async () => {
    jest.useFakeTimers();
    render(<HintIcon hint="Detailed field explanation" />);

    const buttons = screen.getAllByLabelText('More information');
    const iconButton = buttons.find(b => b.tagName === 'BUTTON');
    
    fireEvent.mouseEnter(iconButton!);
    act(() => jest.advanceTimersByTime(150)); // HintIcon uses delay=100

    expect(screen.getByRole('tooltip')).toHaveTextContent('Detailed field explanation');

    jest.useRealTimers();
  });

  it('should use default variant (border accent)', async () => {
    jest.useFakeTimers();
    render(<HintIcon hint="Info text" />);

    const buttons = screen.getAllByLabelText('More information');
    const iconButton = buttons.find(b => b.tagName === 'BUTTON');

    fireEvent.mouseEnter(iconButton!);
    act(() => jest.advanceTimersByTime(150));

    const tooltip = screen.getByRole('tooltip');
    // Default variant uses border-l-border
    expect(tooltip.className).toContain('border-l-border');

    jest.useRealTimers();
  });

  it('should use info variant when specified', async () => {
    jest.useFakeTimers();
    render(<HintIcon hint="Info text" variant="info" />);

    const buttons = screen.getAllByLabelText('More information');
    const iconButton = buttons.find(b => b.tagName === 'BUTTON');

    fireEvent.mouseEnter(iconButton!);
    act(() => jest.advanceTimersByTime(150));

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.className).toContain('border-l-blue-500');

    jest.useRealTimers();
  });

  it('should use error variant when specified', async () => {
    jest.useFakeTimers();
    render(<HintIcon hint="Error explanation" variant="error" />);

    const buttons = screen.getAllByLabelText('More information');
    const iconButton = buttons.find(b => b.tagName === 'BUTTON');

    fireEvent.mouseEnter(iconButton!);
    act(() =>jest.advanceTimersByTime(150));

    expect(screen.getByRole('tooltip').className).toContain('border-l-red-500');

    jest.useRealTimers();
  });
});

// ─────────────────────────────────────────────
// FieldHint Tests
// ─────────────────────────────────────────────

describe('FieldHint', () => {
  it('should render static mode as a paragraph with icon and text', () => {
    render(<FieldHint hint="Always visible help" mode="static" />);

    expect(screen.getByText('Always visible help')).toBeInTheDocument();
  });

  it('should render tooltip mode with hover prompt', () => {
    render(<FieldHint hint="Hidden until hovered" mode="tooltip" />);

    expect(screen.getByText('Hover for help')).toBeInTheDocument();
  });

  it('should default to tooltip mode', () => {
    render(<FieldHint hint="Default is tooltip" />);

    // Should show "Hover for help" text since default is tooltip mode
    expect(screen.getByText('Hover for help')).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────
// useTooltip Hook Tests
// ─────────────────────────────────────────────

function TestHookComponent() {
  const { visible, show, hide, toggle } = useTooltip(200);
  return (
    <div>
      <span data-testid="state">{visible ? 'visible' : 'hidden'}</span>
      <button onClick={() => show()}>Show</button>
      <button onClick={() => show(true)}>Show Instant</button>
      <button onClick={hide}>Hide</button>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}

describe('useTooltip', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should start hidden', () => {
    render(<TestHookComponent />);
    expect(screen.getByTestId('state')).toHaveTextContent('hidden');
  });

  it('should show on show() call after delay', () => {
    render(<TestHookComponent />);
    fireEvent.click(screen.getByText('Show'));
    
    // Before delay — still hidden
    expect(screen.getByTestId('state')).toHaveTextContent('hidden');

    // After default delay (200ms)
    act(() => jest.advanceTimersByTime(250));
    expect(screen.getByTestId('state')).toHaveTextContent('visible');
  });

  it('should hide on hide() call', () => {
    render(<TestHookComponent />);
    fireEvent.click(screen.getByText('Show'));
    act(() => jest.advanceTimersByTime(250));
    expect(screen.getByTestId('state')).toHaveTextContent('visible');

    fireEvent.click(screen.getByText('Hide'));
    expect(screen.getByTestId('state')).toHaveTextContent('hidden');
  });

  it('should toggle between hidden and visible', () => {
    render(<TestHookComponent />);

    // Hidden → Visible (toggle uses show(true) = instant)
    fireEvent.click(screen.getByText('Toggle'));
    // toggle uses skipDelay=true, so it should be instant
    expect(screen.getByTestId('state')).toHaveTextContent('visible');

    // Visible → Hidden
    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('state')).toHaveTextContent('hidden');
  });

  it('should support auto-hide timer', () => {
    function TestAutoHide() {
      const { visible, show } = useTooltip(0, 1000); // auto-hide after 1s
      return (
        <div>
          <span data-testid="state">{visible ? 'visible' : 'hidden'}</span>
          <button onClick={() => show(true)}>Show</button>
        </div>
      );
    }

    render(<TestAutoHide />);
    fireEvent.click(screen.getByText('Show'));
    expect(screen.getByTestId('state')).toHaveTextContent('visible');

    act(() => jest.advanceTimersByTime(1100));
    expect(screen.getByTestId('state')).toHaveTextContent('hidden');
  });
});
