/**
 * MailerLite client (connect.mailerlite.com — the current API; the "Classic" v2
 * API is deprecated).
 *
 * Group ids are resolved from group NAMES at runtime rather than hardcoded in a
 * GROUP_IDS map. Hardcoding means every new group needs a code change and a
 * redeploy, and a mistyped id fails silently (the subscriber lands in no group
 * and never gets an email). Naming the MailerLite groups after our slugs keeps
 * the two in sync with no config step.
 */

const API_BASE = 'https://connect.mailerlite.com/api';

/** Group name -> id. Warm for the lifetime of the serverless instance. */
let groupIdCache: Map<string, string> | null = null;

function apiKey(): string {
  const key = process.env.MAILERLITE_API_KEY;
  if (!key) throw new Error('MAILERLITE_API_KEY is not set');
  return key;
}

async function mailerlite(path: string, init?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey()}`,
      ...init?.headers,
    },
  });
  return res;
}

/**
 * Map our group slugs to MailerLite group ids.
 *
 * Unknown slugs are simply absent from the result — a slug with no matching
 * MailerLite group must never silently become "no group at all", so callers
 * check for the empty case and fall back.
 */
export async function resolveGroupIds(slugs: string[]): Promise<string[]> {
  if (slugs.length === 0) return [];

  if (!groupIdCache) {
    const res = await mailerlite('/groups?limit=100');
    if (!res.ok) {
      console.error('[mailerlite] could not list groups:', res.status);
      return [];
    }
    const body = (await res.json()) as { data?: { id: string; name: string }[] };
    groupIdCache = new Map((body.data ?? []).map((g) => [g.name.trim().toLowerCase(), g.id]));
  }

  return slugs
    .map((slug) => groupIdCache!.get(slug.trim().toLowerCase()))
    .filter((id): id is string => Boolean(id));
}

export type SubscribeInput = {
  email: string;
  name?: string | null;
  country?: string | null;
  groupIds: string[];
};

export type SubscribeResult =
  | { ok: true; status: number }
  | { ok: false; status: number; detail: unknown };

/**
 * Create or update a subscriber.
 *
 * Deliberately does NOT send `resubscribe: true`. That flag reactivates people
 * who previously unsubscribed — a deliverability and compliance problem, and it
 * silently overrides an explicit opt-out.
 *
 * `status: 'unconfirmed'` triggers MailerLite's double opt-in email — but ONLY
 * if double opt-in is enabled in the dashboard (Settings -> Subscribe settings).
 * If it is not, unconfirmed subscribers sit there and never receive a campaign.
 * Hence the env flag: flip MAILERLITE_DOUBLE_OPT_IN=true once it is on.
 */
export async function subscribe({
  email,
  name,
  country,
  groupIds,
}: SubscribeInput): Promise<SubscribeResult> {
  const doubleOptIn = process.env.MAILERLITE_DOUBLE_OPT_IN === 'true';

  const res = await mailerlite('/subscribers', {
    method: 'POST',
    body: JSON.stringify({
      email,
      fields: {
        ...(name ? { name } : {}),
        ...(country ? { country } : {}),
      },
      ...(groupIds.length > 0 ? { groups: groupIds } : {}),
      status: doubleOptIn ? 'unconfirmed' : 'active',
    }),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    return { ok: false, status: res.status, detail };
  }

  return { ok: true, status: res.status };
}
