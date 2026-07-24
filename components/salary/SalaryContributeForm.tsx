'use client';

import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { jobCategories, currencyMap } from '@/constants/job-filters';
import { subscriberCountries } from '@/constants/newsletter-countries';
import {
  experienceLevels,
  companyTypes,
  workArrangements,
  employmentTypes,
  industries,
  malaysianCities,
} from '@/constants/salary-submission';

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30';

const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

export default function SalaryContributeForm() {
  const [jobCategory, setJobCategory] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [workArrangement, setWorkArrangement] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [industry, setIndustry] = useState('');
  const [bonusMonths, setBonusMonths] = useState('');
  const [website, setWebsite] = useState(''); // honeypot

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const symbol = country === 'Singapore' ? 'S$' : 'RM';
  const required = jobCategory && country && yearsExperience && monthlySalary;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!required) {
      setError('Please fill in the four required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/salary-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobCategory,
          jobTitle,
          country,
          city,
          yearsExperience,
          monthlySalary: Number(monthlySalary),
          companyType,
          workArrangement,
          employmentType,
          industry,
          bonusMonths,
          website,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Something went wrong.');
        return;
      }
      setDone(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50/70 p-6 text-center">
        <p className="text-lg font-bold text-green-900">Thank you.</p>
        <p className="mt-1.5 text-sm text-green-900/80">
          Your salary is in. Once enough people contribute we can publish real numbers for
          categories that have no reliable data today.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div>
        <label htmlFor="jobCategory" className={labelClass}>
          Job category <span className="text-red-500">*</span>
        </label>
        <select
          id="jobCategory"
          value={jobCategory}
          onChange={(e) => setJobCategory(e.target.value)}
          required
          className={inputClass}
        >
          <option value="">Select a category</option>
          {jobCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="jobTitle" className={labelClass}>
          Job title <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="jobTitle"
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g. Senior Machine Learning Engineer"
          className={inputClass}
        />
      </div>

      <fieldset>
        <legend className={labelClass}>
          Country <span className="text-red-500">*</span>
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {subscriberCountries.map((name) => {
            const checked = country === name;
            return (
              <label
                key={name}
                className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 transition ${
                  checked ? 'border-[#1D4ED8]/40 bg-blue-50/60' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="country"
                  value={name}
                  checked={checked}
                  onChange={() => {
                    setCountry(name);
                    if (name !== 'Malaysia') setCity('');
                  }}
                  className="h-4 w-4 accent-[#1D4ED8] cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-900">{name}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Singapore is a city-state, so the city question only applies to Malaysia. */}
      {country === 'Malaysia' && (
        <div>
          <label htmlFor="city" className={labelClass}>
            City <span className="text-gray-400">(optional)</span>
          </label>
          <select id="city" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass}>
            <option value="">Prefer not to say</option>
            {malaysianCities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="yearsExperience" className={labelClass}>
          Years of experience <span className="text-red-500">*</span>
        </label>
        <select
          id="yearsExperience"
          value={yearsExperience}
          onChange={(e) => setYearsExperience(e.target.value)}
          required
          className={inputClass}
        >
          <option value="">Select experience</option>
          {experienceLevels.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="monthlySalary" className={labelClass}>
          Gross monthly salary <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
            {symbol}
          </span>
          <input
            id="monthlySalary"
            type="number"
            inputMode="numeric"
            min={0}
            step={100}
            value={monthlySalary}
            onChange={(e) => setMonthlySalary(e.target.value)}
            placeholder="8000"
            required
            className={`${inputClass} pl-11`}
          />
        </div>
        <p className="mt-1.5 text-xs text-gray-500">
          Before {country === 'Singapore' ? 'CPF' : 'EPF'} and tax. Monthly, not annual.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="companyType" className={labelClass}>
            Company type <span className="text-gray-400">(optional)</span>
          </label>
          <select
            id="companyType"
            value={companyType}
            onChange={(e) => setCompanyType(e.target.value)}
            className={inputClass}
          >
            <option value="">Prefer not to say</option>
            {companyTypes.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="workArrangement" className={labelClass}>
            Work arrangement <span className="text-gray-400">(optional)</span>
          </label>
          <select
            id="workArrangement"
            value={workArrangement}
            onChange={(e) => setWorkArrangement(e.target.value)}
            className={inputClass}
          >
            <option value="">Prefer not to say</option>
            {workArrangements.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="industry" className={labelClass}>
            Industry <span className="text-gray-400">(optional)</span>
          </label>
          <select
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className={inputClass}
          >
            <option value="">Prefer not to say</option>
            {industries.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="employmentType" className={labelClass}>
            Employment type <span className="text-gray-400">(optional)</span>
          </label>
          <select
            id="employmentType"
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className={inputClass}
          >
            <option value="">Prefer not to say</option>
            {employmentTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="bonusMonths" className={labelClass}>
          Annual bonus, in months <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="bonusMonths"
          type="number"
          inputMode="decimal"
          min={0}
          max={24}
          step={0.5}
          value={bonusMonths}
          onChange={(e) => setBonusMonths(e.target.value)}
          placeholder="e.g. 2"
          className={inputClass}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading || !required}
        className="w-full rounded-xl bg-[#1D4ED8] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1E40AF] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Submitting…' : 'Submit anonymously'}
      </button>

      <p className="flex items-start gap-2 text-xs text-gray-500">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
        <span>
          We never ask for your name, email or employer, so a submission cannot be traced back
          to you. Only aggregated ranges are ever published.
        </span>
      </p>
    </form>
  );
}
