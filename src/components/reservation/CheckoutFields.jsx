import { Check } from 'lucide-react';
import './CheckoutFields.css';

export function InfoTable({ rows }) {
  return (
    <dl className="checkout-info-table">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Field({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <label className="checkout-field">
      <span>{label}<em>*</em></span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        required
      />
    </label>
  );
}

export function ChoiceGroup({ label, value, options, onChange }) {
  return (
    <div className="checkout-choice">
      <span>{label}<em>*</em></span>
      <div>
        {options.map((option) => (
          <button
            type="button"
            key={option}
            className={value === option ? 'is-selected' : ''}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Agreement({ checked, onChange, children }) {
  return (
    <label className="checkout-agreement">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span><Check size={14} /></span>
      {children}
      <b>›</b>
    </label>
  );
}
