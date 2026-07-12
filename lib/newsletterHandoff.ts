/**
 * The compact signup forms (homepage CTA, sidebar, exit popup, inline card) are
 * entry points, not the form itself. They capture an email and hand off to
 * /newsletter, where the subscriber finishes: name, country, and which of the
 * four groups they actually want.
 *
 * Why not put the full form in each of them: the exit popup and the sidebar
 * work *because* they are one field. Four checkboxes plus a name and a country
 * in a modal is a different, worse thing. And a second copy of the form is a
 * second thing to update the day a fifth group is added.
 *
 * The email travels in the query string, so it survives a full page load and
 * can be linked to directly. It is not a secret — the user just typed it.
 */
export const NEWSLETTER_FORM_ANCHOR = 'subscribe';

/** Set once the signup completes, so the inline card stops nagging. */
export const SUBSCRIBED_COOKIE = 'kr_subscribed';

export function newsletterHandoffHref(email: string): string {
  const trimmed = email.trim();
  if (!trimmed) return `/newsletter#${NEWSLETTER_FORM_ANCHOR}`;
  return `/newsletter?email=${encodeURIComponent(trimmed)}#${NEWSLETTER_FORM_ANCHOR}`;
}

/** Loose on purpose — the real check is the server's, this only catches typos. */
export function looksLikeEmail(value: string): boolean {
  return /\S+@\S+\.\S+/.test(value.trim());
}
