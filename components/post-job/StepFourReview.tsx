'use client';

import Image from 'next/image';
import type { FormData } from '@/types/job';
import { useEffect, useMemo, useRef, useState, type ElementType } from 'react';
import { validateFields, type ValidationErrors } from '@/utils/validateFields';
import DOMPurify from 'dompurify';
import { Pencil, Building2, Briefcase, FileText, CheckCircle } from 'lucide-react';

type Props = {
  formData: FormData;
  prevStep: () => void;
  handleSubmit: () => void;
  goToStep: (step: number) => void;
  isSubmitting?: boolean;
};

// Decode HTML entities if description was stored as "&lt;p&gt;..."
function decodeHtmlEntities(input: string) {
  if (!input) return '';
  if (!input.includes('&lt;') && !input.includes('&gt;') && !input.includes('&amp;')) return input;
  const textarea = document.createElement('textarea');
  textarea.innerHTML = input;
  return textarea.value;
}

function SectionHeader({ icon: Icon, title, step, onEdit }: { icon: ElementType; title: string; step: number; onEdit: (step: number) => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
          <Icon className="w-4 h-4 text-gray-500" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <button
        type="button"
        onClick={() => onEdit(step)}
        className="flex items-center gap-1 text-xs text-[#1D4ED8] hover:underline"
      >
        <Pencil className="w-3 h-3" />
        Edit
      </button>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900 mt-0.5 break-words">{value}</dd>
    </div>
  );
}

export default function StepFourReview({ formData, prevStep, handleSubmit, goToStep, isSubmitting = false }: Props) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Create a stable object URL and revoke it when logo changes or component unmounts
  const logoBlobUrl = useRef<string | null>(null);
  const logoPreviewUrl = useMemo(() => {
    if (logoBlobUrl.current) URL.revokeObjectURL(logoBlobUrl.current);
    if (!formData.companyLogo) { logoBlobUrl.current = null; return null; }
    const url = URL.createObjectURL(formData.companyLogo);
    logoBlobUrl.current = url;
    return url;
  }, [formData.companyLogo]);
  useEffect(() => () => { if (logoBlobUrl.current) URL.revokeObjectURL(logoBlobUrl.current); }, []);

  const validateBeforeSubmit = () => {
    const validation = validateFields(formData, [
      'companyName',
      'companyWebsite',
      'contactEmail',
      'jobTitle',
      'jobType',
      'jobCategory',
      'jobLocation',
      'description',
      'applyUrl',
    ]);

    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setErrors({});
    handleSubmit();
  };

  // Clean + safe HTML for preview
  const cleanedDescriptionHtml = useMemo(() => {
    const raw = formData.description || '';
    const decoded = typeof window !== 'undefined' ? decodeHtmlEntities(raw) : raw;
    return DOMPurify.sanitize(decoded, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
      FORBID_ATTR: ['style', 'onerror', 'onclick', 'onload'],
    });
  }, [formData.description]);

  const tagList = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);
  const salaryText = formData.minSalary || formData.maxSalary
    ? `${formData.minSalary || '—'} – ${formData.maxSalary || '—'} ${formData.currency}`
    : null;

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-base font-semibold text-gray-900">Review Your Listing</h2>
        <p className="text-xs text-gray-500 mt-0.5">Check everything looks correct before posting.</p>
      </div>

      <div className="divide-y divide-gray-100">
        {/* Company Section */}
        <div className="p-6">
          <SectionHeader icon={Building2} title="Company" step={1} onEdit={goToStep} />
          <div className="flex items-start gap-4">
            {logoPreviewUrl && (
              <Image
                src={logoPreviewUrl}
                alt="Company Logo"
                width={56}
                height={56}
                className="rounded-xl object-contain border border-gray-100 flex-shrink-0"
              />
            )}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 flex-1">
              <Field label="Company Name" value={formData.companyName} />
              <Field label="Website" value={formData.companyWebsite} />
              <Field label="Contact Email" value={formData.contactEmail} />
              {formData.companyTagline && <Field label="Tagline" value={formData.companyTagline} />}
            </dl>
          </div>
          {errors.companyName || errors.companyWebsite || errors.contactEmail ? (
            <p className="text-red-500 text-xs mt-3">Please fix company details.</p>
          ) : null}
        </div>

        {/* Job Details Section */}
        <div className="p-6">
          <SectionHeader icon={Briefcase} title="Job Details" step={2} onEdit={goToStep} />
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            <Field label="Job Title" value={formData.jobTitle} />
            <Field label="Job Type" value={formData.jobType} />
            <Field label="Work Setup" value={formData.remoteType} />
            <Field label="Category" value={formData.jobCategory} />
            <Field label="Location" value={formData.jobLocation} />
            {salaryText && <Field label="Salary Range" value={salaryText} />}
            {formData.applyUrl && <Field label="Apply URL / Email" value={formData.applyUrl} />}
          </dl>
          {tagList.length > 0 && (
            <div className="mt-3">
              <dt className="text-xs text-gray-500 mb-1.5">Tags</dt>
              <div className="flex flex-wrap gap-1.5">
                {tagList.map((tag) => (
                  <span key={tag} className="inline-block bg-gray-100 text-xs text-gray-700 px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          {errors.jobTitle || errors.jobType || errors.jobCategory || errors.jobLocation || errors.applyUrl ? (
            <p className="text-red-500 text-xs mt-3">Please fix job details.</p>
          ) : null}
        </div>

        {/* Description Section */}
        <div className="p-6">
          <SectionHeader icon={FileText} title="Job Description" step={3} onEdit={goToStep} />
          <div className="border border-gray-200 bg-gray-50 rounded-xl p-4">
            {cleanedDescriptionHtml?.trim() ? (
              <div
                className="prose prose-sm sm:prose-base prose-slate max-w-none
                  prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2
                  prose-ul:my-2 prose-ol:my-2 prose-li:my-1
                  prose-a:text-blue-600 prose-a:underline prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: cleanedDescriptionHtml }}
              />
            ) : (
              <p className="text-sm text-gray-400">No description provided.</p>
            )}
          </div>
          {errors.description && (
            <p className="text-red-500 text-xs mt-2">{errors.description}</p>
          )}
        </div>
      </div>

      {/* Validation Summary */}
      {hasErrors && (
        <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 text-sm text-red-600 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          Please fix the highlighted issues above before submitting.
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex gap-3">
        <button
          type="button"
          onClick={prevStep}
          disabled={isSubmitting}
          className="w-1/3 bg-gray-100 text-gray-700 font-medium py-3 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={validateBeforeSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-[#1D4ED8] text-white font-semibold py-3 rounded-lg hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity text-sm"
        >
          {isSubmitting ? 'Posting…' : 'Post Job →'}
        </button>
      </div>
    </div>
  );
}
