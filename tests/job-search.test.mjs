import test from 'node:test';
import assert from 'node:assert/strict';

import { jobMatchesKeyword } from '../lib/jobSearch.ts';

const job = (over = {}) => ({
  title: 'Applied AI Engineer',
  company: { name: 'Bjak' },
  job_category: ['AI Engineering', 'Machine Learning Engineering'],
  tags: ['Python', 'PyTorch'],
  job_type: ['Full-Time'],
  job_location: ['Malaysia'],
  city: 'Kuala Lumpur',
  remote_type: 'Hybrid',
  ...over,
});

test('matches a CATEGORY that is not in the job title', () => {
  // The regression: the homepage quick-search pills push category names, and
  // "Applied AI Engineer" does not contain the substring "ai engineering".
  // Title-only search returned zero jobs for 4 of the 5 pills.
  assert.ok(jobMatchesKeyword(job(), 'AI Engineering'));
  assert.ok(jobMatchesKeyword(job(), 'Machine Learning'));
});

test('matches word-by-word, not as one literal substring', () => {
  // "data science" is not a substring of "Data Scientist".
  const ds = job({ title: 'Data Scientist', job_category: ['Data Science'] });
  assert.ok(jobMatchesKeyword(ds, 'data science'));
});

test('every word must match (AND), not just one', () => {
  assert.ok(jobMatchesKeyword(job(), 'python bjak'));
  assert.ok(!jobMatchesKeyword(job(), 'python rust'));
});

test('searches company, tags, city and remote type too', () => {
  assert.ok(jobMatchesKeyword(job(), 'Bjak'));
  assert.ok(jobMatchesKeyword(job(), 'PyTorch'));
  assert.ok(jobMatchesKeyword(job(), 'Kuala Lumpur'));
  assert.ok(jobMatchesKeyword(job(), 'Hybrid'));
});

test('is case-insensitive and ignores extra whitespace', () => {
  assert.ok(jobMatchesKeyword(job(), '  ai   ENGINEERING  '));
});

test('an empty query matches everything; nonsense matches nothing', () => {
  assert.ok(jobMatchesKeyword(job(), ''));
  assert.ok(jobMatchesKeyword(job(), '   '));
  assert.ok(!jobMatchesKeyword(job(), 'zzz-no-such-thing'));
});

test('degrades safely on missing fields', () => {
  const sparse = {
    title: 'Data Analyst',
    company: null,
    job_category: null,
    tags: null,
    job_type: null,
    job_location: null,
    city: null,
    remote_type: null,
  };
  assert.ok(jobMatchesKeyword(sparse, 'analyst'));
  assert.ok(!jobMatchesKeyword(sparse, 'engineer'));
});
