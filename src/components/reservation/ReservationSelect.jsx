import { useEffect, useId, useRef, useState } from 'react';
import './ReservationSpacing.css';

export default function ReservationSelect({ label, value, options, onChange, active = false, className = '' }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    rootRef.current.querySelector('[aria-selected="true"]')?.focus();
    const closeOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);

  const close = () => {
    setOpen(false);
    triggerRef.current.focus();
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      if (!open) { setOpen(true); return; }
      const buttons = [...rootRef.current.querySelectorAll('[role="option"]')];
      const index = buttons.indexOf(document.activeElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1
        : (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next]?.focus();
    }
  };

  return <div ref={rootRef} className={`reservation-select${active ? ' is-active' : ''}${className ? ` ${className}` : ''}`}
    onKeyDown={handleKeyDown} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
    <button ref={triggerRef} type="button" className="reservation-select__trigger"
      aria-label={`${label}: ${selected?.label || ''}`} aria-haspopup="listbox"
      aria-expanded={open} aria-controls={open ? listId : undefined}
      onClick={() => setOpen((current) => !current)}>{selected?.label}</button>
    {open && <div id={listId} role="listbox" aria-label={label} className="reservation-select__options">
      {options.map((option) => <button key={option.value} type="button" role="option"
        aria-selected={option.value === value} tabIndex={-1}
        onClick={() => { onChange(option.value); close(); }}>{option.label}</button>)}
    </div>}
  </div>;
}
