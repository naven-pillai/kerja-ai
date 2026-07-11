import { Globe2, Building2 } from 'lucide-react';

type Props = {
  /** '100% Remote' | 'Hybrid' — anything falsy renders nothing. */
  remoteType?: string | null;
  className?: string;
};

/** Tiny pill telling candidates at a glance whether a job is fully remote or hybrid. */
export default function RemoteTypePill({ remoteType, className = '' }: Props) {
  if (!remoteType) return null;

  const isHybrid = remoteType === 'Hybrid';
  const Icon = isHybrid ? Building2 : Globe2;

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
        isHybrid
          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
      } ${className}`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      {remoteType}
    </span>
  );
}
