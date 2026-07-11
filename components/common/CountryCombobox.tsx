'use client';

import { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { getCountryList } from '@/utils/getCountries';

const countries = getCountryList();

type Props = {
  selected: string;
  onChange: (val: string) => void;
  inputClassName?: string;
};

export default function CountryCombobox({ selected, onChange, inputClassName }: Props) {
  const [query, setQuery] = useState('');

  const filtered =
    query === ''
      ? countries
      : countries.filter((c) =>
          c.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Combobox
      value={selected}
      onChange={(value) => onChange(value ?? '')} // ✅ FIX HERE
    >
      <div className="relative">
        <Combobox.Input
          className={inputClassName ?? "w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-400"}
          placeholder="Select your country"
          displayValue={(val: string) => val}
          onChange={(e) => setQuery(e.target.value)}
        />

        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg border border-gray-200 text-sm">
          {filtered.length === 0 && (
            <div className="px-4 py-2 text-gray-500">No results</div>
          )}

          {filtered.map((c) => (
            <Combobox.Option
              key={c.code}
              value={c.name}
              className={({ active }) =>
                `cursor-pointer px-4 py-2 ${
                  active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                }`
              }
            >
              {c.label}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  );
}
