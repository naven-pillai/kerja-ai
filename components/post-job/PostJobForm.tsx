'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import StepOneCompany from '@/components/post-job/StepOneCompany';
import StepTwoJob from '@/components/post-job/StepTwoJob';
import StepThreeJobDescription from '@/components/post-job/StepThreeJobDescription';
import StepFourReview from '@/components/post-job/StepFourReview';
import StepNavigation from '@/components/post-job/StepNavigation';
import { createSupabaseClient } from '@/lib/supabase-client';
import toast from 'react-hot-toast';

type FormData = {
  companyName: string;
  companyTagline: string;
  companyWebsite: string;
  companyFacebook?: string;
  companyX?: string;
  companyLinkedIn?: string;
  contactEmail: string;
  companyLogo: File | null;

  jobTitle: string;
  jobCategory: string;
  jobType: string;
  jobLocation: string;
  remoteType: string;

  currency: string;
  minSalary: string;
  maxSalary: string;

  tags: string;
  description: string;
  applyUrl: string;
  is_featured: boolean;
};

type Props = {
  isPaid?: boolean;
  isFeatured?: boolean;
  stripeSessionId?: string;
};

export default function PostJobForm({ isPaid = false, isFeatured = false, stripeSessionId }: Props) {
  const router = useRouter();
  // Stable client — created once, not on every render
  const supabase = useMemo(() => createSupabaseClient(), []);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stepRef = useRef<HTMLDivElement | null>(null);

  // Auto-focus first field + scroll top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    requestAnimationFrame(() => {
      const root = stepRef.current;
      if (!root) return;
      const preferred = root.querySelector<HTMLElement>('[data-autofocus="true"]');
      const firstFocusable = preferred ?? root.querySelector<HTMLElement>(
        [
          'input:not([type="hidden"]):not([disabled])',
          'textarea:not([disabled])',
          'select:not([disabled])',
          '[tabindex]:not([tabindex="-1"])',
        ].join(',')
      );
      if (firstFocusable) firstFocusable.focus({ preventScroll: true });
    });
  }, [currentStep]);

  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    companyTagline: '',
    companyWebsite: '',
    companyFacebook: '',
    companyX: '',
    companyLinkedIn: '',
    contactEmail: '',
    companyLogo: null,
    jobTitle: '',
    jobCategory: '',
    jobType: '',
    jobLocation: '',
    remoteType: '100% Remote',
    currency: 'USD',
    minSalary: '',
    maxSalary: '',
    tags: '',
    description: '',
    applyUrl: '',
    is_featured: isFeatured,
  });

  const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);
  const goToStep = (step: number) => setCurrentStep(step);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const toastId = toast.loading('Posting your job...');

    try {
      const jobTitle = formData.jobTitle.trim();
      const companyName = formData.companyName.trim();

      if (!jobTitle || !companyName) {
        toast.dismiss(toastId);
        toast.error('Job title and company name are required.');
        return;
      }

      // ── Logo upload ──────────────────────────────────────────────────────
      let logoUrl = '';
      if (formData.companyLogo) {
        const fileName = `logos/${Date.now()}-${formData.companyLogo.name}`;
        const { error: uploadError } = await supabase.storage
          .from('company-logos')
          .upload(fileName, formData.companyLogo);

        if (uploadError) throw new Error('Logo upload failed');

        const { data: urlData } = supabase.storage.from('company-logos').getPublicUrl(fileName);
        logoUrl = urlData?.publicUrl || '';
      }

      // ── Submit via the hardened server route (service role + rate limit).
      // The public anon client no longer writes jobs/companies directly.
      const submitRes = await fetch('/api/submit-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          companyName,
          companyTagline: formData.companyTagline,
          companyWebsite: formData.companyWebsite,
          companyFacebook: formData.companyFacebook,
          companyX: formData.companyX,
          companyLinkedIn: formData.companyLinkedIn,
          contactEmail: formData.contactEmail,
          logoUrl,
          jobCategory: formData.jobCategory,
          jobType: formData.jobType,
          jobLocation: formData.jobLocation,
          remoteType: formData.remoteType || '100% Remote',
          currency: formData.currency,
          minSalary: formData.minSalary ? parseFloat(formData.minSalary) : null,
          maxSalary: formData.maxSalary ? parseFloat(formData.maxSalary) : null,
          tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
          description: formData.description,
          applyUrl: formData.applyUrl,
        }),
      });

      if (!submitRes.ok) {
        const err = await submitRes.json().catch(() => ({}));
        throw new Error(err.error || 'Job submission failed');
      }

      // ── Notification emails (admin + submitter) ──────────────────────────
      // Fire-and-forget — don't block success on email failure
      fetch('/api/send-job-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: formData.jobTitle,
          companyName: formData.companyName,
          contactEmail: formData.contactEmail,
          companyWebsite: formData.companyWebsite,
          applyUrl: formData.applyUrl,
          jobCategory: formData.jobCategory,
          jobType: formData.jobType,
          jobLocation: formData.jobLocation,
          minSalary: formData.minSalary ? parseFloat(formData.minSalary) : null,
          maxSalary: formData.maxSalary ? parseFloat(formData.maxSalary) : null,
          tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      }).catch(() => {
        // Email failure is non-fatal — job is already saved
        console.warn('Notification email failed to send');
      });

      toast.dismiss(toastId);
      toast.success('Job submitted for review!');
      router.push('/post-success');
    } catch (error) {
      console.error('❌ Post Job Error:', error);
      toast.dismiss(toastId);
      toast.error('Failed to post job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white py-24">
      <div className="max-w-3xl mx-auto px-4">
        <StepNavigation currentStep={currentStep} goToStep={goToStep} />

        <div ref={stepRef} className="mt-6">
          {currentStep === 1 && (
            <StepOneCompany formData={formData} handleChange={handleChange} nextStep={nextStep} />
          )}

          {currentStep === 2 && (
            <StepTwoJob
              formData={formData}
              handleChange={handleChange}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}

          {currentStep === 3 && (
            <StepThreeJobDescription
              formData={formData}
              handleChange={handleChange}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}

          {currentStep === 4 && (
            <StepFourReview
              formData={formData}
              prevStep={prevStep}
              handleSubmit={handleSubmit}
              goToStep={goToStep}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </section>
  );
}
