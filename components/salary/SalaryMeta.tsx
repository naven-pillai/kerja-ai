import { METHODOLOGY_NOTE, salarySources, type SalaryCountry } from '@/constants/salary-data';

/**
 * Methodology + sources. Shown on every salary page: a reader looking at a pay
 * band deserves to see where it came from and what it excludes.
 */
export default function SalaryMeta({ countries }: { countries: SalaryCountry[] }) {
  return (
    <section className="mt-10 rounded-2xl border border-gray-200 bg-gray-50/60 p-5 md:p-6">
      <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">
        How we built these numbers
      </h2>

      <p className="mt-3 text-sm leading-relaxed text-gray-600">{METHODOLOGY_NOTE}</p>

      {countries.map((country) => (
        <div key={country} className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {country} sources
          </p>
          <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
            {salarySources[country].map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-sm text-[#1D4ED8] underline underline-offset-2 hover:text-[#1E40AF]"
                >
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <p className="mt-4 text-xs text-gray-500">Last reviewed July 2026.</p>
    </section>
  );
}
