import test from 'node:test';
import assert from 'node:assert/strict';

import {
  salaryRoles,
  salaryCountries,
  salaryData,
  salarySources,
  currencyByCountry,
  roleFromSlug,
  countryFromSlug,
  slugifyCountry,
  formatMonthly,
  legacyCategorySlugToRoleSlug,
} from '../constants/salary-data.ts';
import { jobCategories } from '../constants/job-filters.ts';

test('every salary role maps to a real job category', () => {
  // The role name is what a reader searches for; the category is what links the
  // page back to the board. A role pointing at a category the board does not
  // list would produce a "browse jobs" link that finds nothing.
  for (const role of salaryRoles) {
    assert.ok(
      jobCategories.includes(role.jobCategory),
      `"${role.name}" maps to "${role.jobCategory}", which is not a job category`
    );
  }
});

test('roles are named for the job, not the field', () => {
  // "Data Scientist", not "Data Science" — the thing a person is, not the
  // discipline. Every one of ours ends in a noun for a person.
  for (const role of salaryRoles) {
    assert.doesNotMatch(role.name, /(ing|ence|Science)$/, `"${role.name}" reads as a field`);
  }
});

test('we only publish the roles with credible local data', () => {
  // Deliberately four. Adding one means new sourcing, not just a new entry —
  // this test is here to make that a conscious decision.
  assert.equal(salaryRoles.length, 4);
});

test('every country/category pair has a band', () => {
  for (const country of salaryCountries) {
    for (const role of salaryRoles) {
      assert.ok(salaryData[country]?.[role.slug], `missing ${country} / ${role.name}`);
    }
  }
});

test('bands rise with seniority and never invert', () => {
  for (const country of salaryCountries) {
    for (const role of salaryRoles) {
      const { entry, mid, senior, overall } = salaryData[country][role.slug];
      const where = `${country} / ${role.name}`;

      for (const [name, b] of [['entry', entry], ['mid', mid], ['senior', senior]]) {
        assert.ok(b.min > 0, `${where} ${name} min must be positive`);
        assert.ok(b.max > b.min, `${where} ${name} max must exceed min`);
      }

      assert.ok(mid.max > entry.max, `${where}: mid should top out above entry`);
      assert.ok(senior.max > mid.max, `${where}: senior should top out above mid`);
      assert.ok(mid.min >= entry.min, `${where}: mid floor should not be below entry`);
      assert.ok(senior.min >= mid.min, `${where}: senior floor should not be below mid`);

      assert.equal(overall.min, entry.min, `${where}: overall floor is the entry floor`);
      assert.equal(overall.max, senior.max, `${where}: overall ceiling is the senior ceiling`);
    }
  }
});

test('figures are monthly, not annual', () => {
  // A stray annual figure would render as a wildly wrong monthly band. Nothing
  // in these two markets pays a six-figure monthly salary at senior level.
  for (const country of salaryCountries) {
    for (const role of salaryRoles) {
      const { overall } = salaryData[country][role.slug];
      assert.ok(overall.max < 60_000, `${country} / ${role.name}: ${overall.max} looks annual`);
      assert.ok(overall.min > 1_000, `${country} / ${role.name}: ${overall.min} looks too low`);
    }
  }
});

test('slugs round-trip', () => {
  for (const role of salaryRoles) {
    assert.equal(roleFromSlug(role.slug), role);
  }
  for (const country of salaryCountries) {
    assert.equal(countryFromSlug(slugifyCountry(country)), country);
  }
});

test('unknown slugs resolve to null rather than throwing', () => {
  assert.equal(roleFromSlug('prompt-engineer'), null);
  assert.equal(roleFromSlug(''), null);
  assert.equal(countryFromSlug('indonesia'), null);
});

test('every retired category URL still points somewhere real', () => {
  // These shipped live and are indexed. A typo here is a 404 on a page that
  // used to work, which is worse than never having published it.
  for (const [legacy, roleSlug] of Object.entries(legacyCategorySlugToRoleSlug)) {
    assert.ok(roleFromSlug(roleSlug), `${legacy} redirects to unknown role "${roleSlug}"`);
  }
  assert.equal(Object.keys(legacyCategorySlugToRoleSlug).length, salaryRoles.length);
});

test('slugs are URL-safe', () => {
  for (const role of salaryRoles) {
    assert.match(role.slug, /^[a-z0-9-]+$/);
  }
});

test('each country cites multiple sources', () => {
  // "Verified with multiple sources" is the whole premise of these pages.
  for (const country of salaryCountries) {
    const sources = salarySources[country];
    assert.ok(sources.length >= 3, `${country} needs 3+ sources, has ${sources.length}`);
    for (const s of sources) {
      assert.match(s.url, /^https:\/\//, `${country}: ${s.name} needs an https URL`);
      assert.ok(s.name.trim().length > 0);
    }
  }
});

test('currency matches the market', () => {
  assert.equal(currencyByCountry.Malaysia.code, 'MYR');
  assert.equal(currencyByCountry.Singapore.code, 'SGD');
  assert.equal(formatMonthly(6500, 'Malaysia'), 'RM6,500');
  assert.equal(formatMonthly(8000, 'Singapore'), 'S$8,000');
});

test('Singapore pays more than Malaysia in nominal terms', () => {
  // A sanity check on the whole dataset: if this ever flips, a currency or a
  // decimal point has gone wrong somewhere.
  for (const role of salaryRoles) {
    const my = salaryData.Malaysia[role.slug].mid;
    const sg = salaryData.Singapore[role.slug].mid;
    assert.ok(sg.min > my.min, `${role.name}: SGD mid floor should exceed MYR`);
  }
});
