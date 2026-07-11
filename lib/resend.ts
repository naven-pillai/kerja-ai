// lib/resend.ts
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)
if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables');
}
// Ensure the Resend API key is set before creating an instance
// This will throw an error if the key is not defined, preventing further execution
// and making it clear that the environment variable is required.   