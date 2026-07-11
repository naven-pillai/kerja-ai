// utils/validateFields.ts

import { FormData } from '@/types/job';

export type ValidationErrors = Partial<Record<keyof FormData, string>>;

// Utility function to validate a set of fields from formData
export function validateFields(
  formData: FormData,
  fieldsToValidate: (keyof FormData)[]
): ValidationErrors {
  const errors: ValidationErrors = {};

  fieldsToValidate.forEach((field) => {
    const value = formData[field];

    switch (field) {
      case 'companyName':
      case 'jobTitle':
        if (!value || (typeof value === 'string' && value.trim().length < 3)) {
          errors[field] = 'This field is required and must be at least 3 characters.';
        }
        break;

      case 'contactEmail':
        if (!value || typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          errors[field] = 'A valid contact email is required.';
        }
        break;

      case 'companyWebsite':
        if (!value || typeof value !== 'string' || !isValidUrl(value)) {
          errors[field] = 'Must be a valid URL (e.g. https://company.com).';
        }
        break;

      case 'applyUrl':
        if (!value || typeof value !== 'string' || !isValidUrlOrEmail(value)) {
          errors[field] = 'Must be a valid URL or email address.';
        }
        break;

      case 'jobCategory':
      case 'jobType':
      case 'jobLocation':
        if (!value) {
          errors[field] = 'This field is required.';
        }
        break;

      case 'description':
        const plainText = (value as string).replace(/<[^>]+>/g, '').trim();
        if (!plainText || plainText.length < 30) {
          errors[field] = 'Description must be at least 30 characters.';
        }
        break;
    }
  });

  return errors;
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value.startsWith('http') ? value : `https://${value}`);
    return url.hostname.includes('.');
  } catch {
    return false;
  }
}

function isValidUrlOrEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return isValidUrl(value) || emailRegex.test(value);
}
