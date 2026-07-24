import {
  formatMonthly,
  type SalaryByLevel,
  type SalaryCountry,
} from '@/constants/salary-data';

const LEVELS = [
  { key: 'entry', label: 'Entry', years: '0–2 years' },
  { key: 'mid', label: 'Mid', years: '3–5 years' },
  { key: 'senior', label: 'Senior', years: '6+ years' },
] as const;

export default function SalaryTable({
  bands,
  country,
}: {
  bands: SalaryByLevel;
  country: SalaryCountry;
}) {
  return (
    // Scrolls inside its own container so a narrow phone never scrolls the page
    // sideways.
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full min-w-[420px] border-collapse text-left">
        <caption className="sr-only">
          Monthly salary bands by experience level in {country}
        </caption>
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600">
              Level
            </th>
            <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600">
              Monthly
            </th>
            <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600">
              Annual equivalent
            </th>
          </tr>
        </thead>
        <tbody>
          {LEVELS.map(({ key, label, years }) => {
            const b = bands[key];
            return (
              <tr key={key} className="border-t border-gray-100">
                <th scope="row" className="px-4 py-3 font-semibold text-gray-900">
                  {label}
                  <span className="block text-xs font-normal text-gray-500">{years}</span>
                </th>
                <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                  {formatMonthly(b.min, country)} – {formatMonthly(b.max, country)}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {formatMonthly(b.min * 12, country)} – {formatMonthly(b.max * 12, country)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
