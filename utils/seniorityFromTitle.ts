/**
 * There is no seniority column, so read it off the job title. Most senior first,
 * so "Senior Staff Engineer" resolves to Lead rather than Senior. Returns null
 * when the title says nothing — better no label than a guessed one.
 *
 * Shared by the job card and the job-detail header so they always agree.
 */
export function seniorityFromTitle(title: string): string | null {
  const t = title.toLowerCase();
  if (/\b(head|director|vp|chief|principal)\b/.test(t)) return 'Lead';
  if (/\b(lead|staff)\b/.test(t)) return 'Lead';
  if (/\b(senior|snr|sr)\b/.test(t)) return 'Senior';
  if (/\b(junior|jnr|graduate|entry|associate)\b/.test(t)) return 'Junior';
  if (/\b(intern|internship)\b/.test(t)) return 'Intern';
  return null;
}
