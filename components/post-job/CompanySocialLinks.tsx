'use client';

type Props = {
  facebook: string;
  x: string;
  linkedin: string;
  onChange: (field: 'facebook' | 'x' | 'linkedin', value: string) => void;
};

export default function CompanySocialLinks({ facebook, x, linkedin, onChange }: Props) {
  const inputClass =
    'w-full mt-2 px-4 py-3 border rounded-lg text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <input
        type="url"
        placeholder="Facebook"
        value={facebook}
        onChange={(e) => onChange('facebook', e.target.value)}
        className={inputClass}
      />
      <input
        type="url"
        placeholder="X (Twitter)"
        value={x}
        onChange={(e) => onChange('x', e.target.value)}
        className={inputClass}
      />
      <input
        type="url"
        placeholder="LinkedIn"
        value={linkedin}
        onChange={(e) => onChange('linkedin', e.target.value)}
        className={inputClass}
      />
    </div>
  );
}
