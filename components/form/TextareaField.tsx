'use client';

import React from 'react';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
};

export default function TextareaField({ label, value, onChange, rows = 3, placeholder }: Props) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full border rounded-lg p-3"
      />
    </div>
  );
}
