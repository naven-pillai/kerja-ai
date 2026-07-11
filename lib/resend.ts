// lib/resend.ts
import { Resend } from 'resend'

let client: Resend | null = null

/**
 * Lazily constructed, on purpose.
 *
 * `new Resend()` throws when the API key is absent, and Next evaluates route
 * modules at build time to collect page data. Constructing at module scope
 * therefore made the *build* depend on a runtime secret being present in the
 * build environment — a deploy without RESEND_API_KEY (e.g. a preview env that
 * only has production vars) failed with "Missing API key" before any request
 * was ever served.
 *
 * Constructing on first use keeps the failure where it belongs: at request time,
 * in the route that actually needs to send mail.
 */
export function getResend(): Resend {
  if (!client) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not defined in environment variables')
    }
    client = new Resend(apiKey)
  }
  return client
}
