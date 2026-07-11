'use client';

type Props = {
  filter: 'all' | 'hiring';
  onChange: (v: 'all' | 'hiring') => void;
  total: number;
  hiringCount: number;
};

export default function CompaniesFilterToggle({ filter, onChange, total, hiringCount }: Props) {
  return (
    <div className="inline-flex w-full sm:w-auto rounded-xl bg-slate-100 p-1">
      <button
        type="button"
        onClick={() => onChange('all')}
        className={[
          'flex-1 sm:flex-none rounded-lg px-4 py-2 text-sm font-semibold transition',
          filter === 'all'
            ? 'bg-gray-900 text-white shadow-sm'
            : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300',
        ].join(' ')}
      >
        All <span className="ml-1 text-xs opacity-80">({total})</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('hiring')}
        className={[
          'ml-1 flex-1 sm:flex-none rounded-lg px-4 py-2 text-sm font-semibold transition',
          filter === 'hiring'
            ? 'bg-gray-900 text-white shadow-sm'
            : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300',
        ].join(' ')}
      >
        Hiring now <span className="ml-1 text-xs opacity-80">({hiringCount})</span>
      </button>
    </div>
  );
}
