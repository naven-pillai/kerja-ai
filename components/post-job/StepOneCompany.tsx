'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import type { FormData } from '@/types/job';
import { validateFields, type ValidationErrors } from '@/utils/validateFields';

type Props = {
  formData: FormData;
  handleChange: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  nextStep: () => void;
};

function Label({ children, htmlFor, optional }: { children: ReactNode; htmlFor?: string; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
      {children}
      {optional && (
        <span className="text-[10px] font-normal text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">Optional</span>
      )}
    </label>
  );
}

export default function StepOneCompany({ formData, handleChange, nextStep }: Props) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Blob URL for the logo preview, revoked when the logo changes or on unmount.
  //
  // The ref this used to keep is gone: it was both read and written inside the
  // useMemo, i.e. during render, which React does not allow — under a re-render
  // that React throws away, it would revoke a URL still on screen. Keying the
  // cleanup to the URL itself does the same job without the ref.
  const logoPreviewUrl = useMemo(
    () => (formData.companyLogo ? URL.createObjectURL(formData.companyLogo) : null),
    [formData.companyLogo]
  );
  useEffect(() => {
    if (!logoPreviewUrl) return;
    return () => URL.revokeObjectURL(logoPreviewUrl);
  }, [logoPreviewUrl]);

  const inputClass = (field: keyof FormData) =>
    `w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
      errors[field] ? 'border-red-400 focus:ring-red-300 bg-red-50' : 'border-gray-300 focus:ring-[#1D4ED8]/30 focus:border-[#1D4ED8]'
    }`;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        handleChange('companyLogo', acceptedFiles[0]);
      }
    },
    [handleChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleNext = () => {
    const validation = validateFields(formData, ['companyName', 'companyWebsite', 'contactEmail']);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setErrors({});
    nextStep();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-base font-semibold text-gray-900">Company Information</h2>
        <p className="text-xs text-gray-500 mt-0.5">Tell us about the company hiring for this role.</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Company Name */}
        <div>
          <Label htmlFor="companyName">Company Name</Label>
          <input
            id="companyName"
            data-autofocus="true"
            type="text"
            placeholder="e.g. Acme Corporation"
            value={formData.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            className={inputClass('companyName')}
          />
          {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
        </div>

        {/* Tagline */}
        <div>
          <Label htmlFor="companyTagline" optional>Tagline</Label>
          <input
            id="companyTagline"
            type="text"
            placeholder="e.g. Applied AI for banks and insurers"
            value={formData.companyTagline}
            onChange={(e) => handleChange('companyTagline', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30 focus:border-[#1D4ED8] transition-colors"
          />
        </div>

        {/* Website */}
        <div>
          <Label htmlFor="companyWebsite">Company Website</Label>
          <input
            id="companyWebsite"
            type="url"
            placeholder="https://company.com"
            value={formData.companyWebsite}
            onChange={(e) => handleChange('companyWebsite', e.target.value)}
            className={inputClass('companyWebsite')}
          />
          {errors.companyWebsite && (
            <p className="text-red-500 text-xs mt-1">{errors.companyWebsite}</p>
          )}
        </div>

        {/* Contact Email */}
        <div>
          <Label htmlFor="contactEmail">Contact Email</Label>
          <input
            id="contactEmail"
            type="email"
            placeholder="hiring@company.com"
            value={formData.contactEmail}
            onChange={(e) => handleChange('contactEmail', e.target.value)}
            className={inputClass('contactEmail')}
          />
          <p className="text-xs text-gray-500 mt-1">Where we email you about your listing. Never shown on the job.</p>
          {errors.contactEmail && (
            <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>
          )}
        </div>

        {/* Social Links */}
        <div>
          <Label optional>Social Links</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="url"
              placeholder="Facebook URL"
              value={formData.companyFacebook || ''}
              onChange={(e) => handleChange('companyFacebook', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30 focus:border-[#1D4ED8] transition-colors"
            />
            <input
              type="url"
              placeholder="X (Twitter) URL"
              value={formData.companyX || ''}
              onChange={(e) => handleChange('companyX', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30 focus:border-[#1D4ED8] transition-colors"
            />
            <input
              type="url"
              placeholder="LinkedIn URL"
              value={formData.companyLinkedIn || ''}
              onChange={(e) => handleChange('companyLinkedIn', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30 focus:border-[#1D4ED8] transition-colors"
            />
          </div>
        </div>

        {/* Logo Upload */}
        <div>
          <Label optional>Company Logo</Label>
          {logoPreviewUrl ? (
            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoPreviewUrl}
                alt="Company Logo"
                className="w-16 h-16 rounded-lg object-contain flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{formData.companyLogo?.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">Logo uploaded</p>
              </div>
              <button
                type="button"
                onClick={() => handleChange('companyLogo', null)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`p-6 border-2 border-dashed rounded-lg cursor-pointer text-center transition-colors ${
                isDragActive
                  ? 'border-[#1D4ED8] bg-[#1D4ED8]/5'
                  : 'border-gray-200 hover:border-[#1D4ED8]/50 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-7 h-7 text-gray-300 mx-auto mb-2" />
              {isDragActive ? (
                <p className="text-sm text-[#1D4ED8] font-medium">Drop your logo here</p>
              ) : (
                <>
                  <p className="text-sm text-gray-500">Drag & drop logo, or <span className="text-[#1D4ED8] font-medium">browse</span></p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG up to 5MB</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
        <button
          type="button"
          onClick={handleNext}
          className="w-full bg-[#1D4ED8] text-white font-semibold py-3 rounded-lg cursor-pointer hover:opacity-95 transition-opacity text-sm"
        >
          Continue to Job Details →
        </button>
      </div>
    </div>
  );
}
