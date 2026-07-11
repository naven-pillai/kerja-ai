import { Globe2, Building2, MapPin } from 'lucide-react';

type Props = {
  /** '100% Remote' | 'Hybrid' | 'Onsite' — anything falsy renders nothing. */
  remoteType?: string | null;
  className?: string;
};

/** Tiny pill telling candidates at a glance the work arrangement. */
export default function RemoteTypePill({ remoteType, className = '' }: Props) {
  if (!remoteType) return null;

  const style =
    remoteType === 'Onsite'
      ? { Icon: MapPin, cls: 'bg-slate-50 text-slate-700 border-slate-200' }
      : remoteType === 'Hybrid'
        ? { Icon: Building2, cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
        : { Icon: Globe2, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };

  const { Icon, cls } = style;

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${cls} ${className}`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      {remoteType}
    </span>
  );
}
