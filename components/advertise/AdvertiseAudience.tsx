import { Globe2, Users, Briefcase, Mail } from 'lucide-react';

type Props = {
  topCountries: Array<{ name: string; count: number; flag?: string }>;
  topRoles: Array<{ name: string; count: number }>;
  reach: Array<{ channel: string; size: string; note: string }>;
};

export default function AdvertiseAudience({ topCountries, topRoles, reach }: Props) {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-[#1D4ED8] uppercase tracking-widest mb-2">
            Who you&apos;re reaching
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            One niche audience, high intent
          </h2>
          <p className="mt-2 text-sm text-gray-500 max-w-xl mx-auto">
            Everyone here came for AI, ML and data work in Malaysia and Singapore.
            That&apos;s a sharper signal than LinkedIn or a general job board can give you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Top countries */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Globe2 className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Top countries</h3>
            </div>
            {(() => {
              const totalCountryCount = topCountries.reduce((sum, c) => sum + c.count, 0);
              const top = topCountries.slice(0, 6);
              return (
                <ul className="space-y-3">
                  {top.map((c) => {
                    const pct = totalCountryCount > 0 ? (c.count / totalCountryCount) * 100 : 0;
                    return (
                      <li key={c.name}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-700 flex items-center">
                            {c.flag && <span className="mr-2">{c.flag}</span>}
                            {c.name}
                          </span>
                          <span className="text-gray-900 font-semibold text-xs">
                            {pct.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              );
            })()}
          </div>

          {/* Top roles */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-violet-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Top roles</h3>
            </div>
            {(() => {
              const totalRoleCount = topRoles.reduce((sum, r) => sum + r.count, 0);
              const top = topRoles.slice(0, 6);
              return (
                <ul className="space-y-3">
                  {top.map((r) => {
                    const pct = totalRoleCount > 0 ? (r.count / totalRoleCount) * 100 : 0;
                    return (
                      <li key={r.name}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-700 truncate pr-2">{r.name}</span>
                          <span className="text-gray-900 font-semibold text-xs shrink-0">
                            {pct.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-500 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              );
            })()}
          </div>

          {/* Channels */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Channels</h3>
            </div>
            <ul className="space-y-2.5">
              {reach.map((r) => (
                <li key={r.channel} className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{r.channel}</span>
                    <span className="text-gray-900 font-bold text-xs">{r.size}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">{r.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter quality signal */}
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 flex items-start gap-4">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Newsletter open rate stays above 35% — well past the ~21% average for job and careers newsletters.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Real opens, not bot inflation. Sent once a week, every week, no fluff.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
