import Link from 'next/link';
import {
  salaryRoles,
  salaryData,
  formatMonthly,
} from '@/constants/salary-data';

/**
 * Malaysia-vs-Singapore pay at a glance, on the homepage. Salary is one of the
 * strongest reasons to use a regional board over LinkedIn, so it earns a spot
 * up front rather than living only under /salary. Numbers come from the same
 * vetted dataset as the salary pages — one source, no drift.
 */
export default function SalarySnapshot() {
  return (
    <section className="bg-[#071426] py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#06B6D4]">
            Salary intelligence
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white">
            What AI & data roles pay here
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-300">
            Gross monthly, entry to senior, in RM and SGD — built from local salary reports.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
          <table className="w-full min-w-[440px] text-left">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Malaysia</th>
                <th className="px-5 py-3 font-semibold">Singapore</th>
              </tr>
            </thead>
            <tbody>
              {salaryRoles.map((role) => {
                const my = salaryData.Malaysia[role.slug].overall;
                const sg = salaryData.Singapore[role.slug].overall;
                return (
                  <tr key={role.slug} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/salary/${role.slug}`}
                        className="font-semibold text-white hover:text-[#20D6B5] transition"
                      >
                        {role.name}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-slate-200">
                      {formatMonthly(my.min, 'Malaysia')}–{formatMonthly(my.max, 'Malaysia')}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-slate-200">
                      {formatMonthly(sg.min, 'Singapore')}–{formatMonthly(sg.max, 'Singapore')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/salary"
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#1677FF] to-[#06B6D4] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            See the full salary guide →
          </Link>
        </div>
      </div>
    </section>
  );
}
