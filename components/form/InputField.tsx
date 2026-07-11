'use client';

import React from 'react';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
};

export default function InputField({ label, value, onChange, type = 'text', required = false, placeholder }: Props) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full border rounded-lg p-3"
      />
    </div>
  );
}
