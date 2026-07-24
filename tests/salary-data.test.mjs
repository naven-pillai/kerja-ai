import test from 'node:test';
import assert from 'node:assert/strict';

import {
  salaryCategories,
  salaryCountries,
  salaryData,
  salarySources,
  currencyByCountry,
  categoryFromSlug,
  countryFromSlug,
  slugifyCategory,
  slugifyCountry,
  formatMonthly,
} from '../constants/salary-data.ts';
import { jobCategories } from '../constants/job-filters.ts';

test('every salary category is a real job category', () => {
  // A salary page for a category the board does not list would be orphan content.
  for (const category of salaryCategories) {
    assert.ok(jobCategories.includes(category), `"${category}" is not a job category`);
  }
});

test('we only publish the categories with credible local data', () => {
  // Deliberately four. Adding one means new sourcing, not just a new entry —
  // this test is here to make that a conscious decision.
  assert.equal(salaryCategories.length, 4);
});

test('every country/category pair has a band', () => {
  for (const country of salaryCountries) {
    for (const category of salaryCategories) {
      assert.ok(salaryData[country]?.[category], `missing ${country} / ${category}`);
    }
  }
});

test('bands rise with seniority and never invert', () => {
  for (const country of salaryCountries) {
    for (const category of salaryCategories) {
      const { entry, mid, senior, overall } = salaryData[country][category];
      const where = `${country} / ${category}`;

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
    for (const category of salaryCategories) {
      const { overall } = salaryData[country][category];
      assert.ok(overall.max < 60_000, `${country} / ${category}: ${overall.max} looks annual`);
      assert.ok(overall.min > 1_000, `${country} / ${category}: ${overall.min} looks too low`);
    }
  }
});

test('slugs round-trip', () => {
  for (const category of salaryCategories) {
    assert.equal(categoryFromSlug(slugifyCategory(category)), category);
  }
  for (const country of salaryCountries) {
    assert.equal(countryFromSlug(slugifyCountry(country)), country);
  }
});

test('unknown slugs resolve to null rather than throwing', () => {
  assert.equal(categoryFromSlug('prompt-engineering'), null);
  assert.equal(categoryFromSlug(''), null);
  assert.equal(countryFromSlug('indonesia'), null);
});

test('slugs are URL-safe', () => {
  for (const category of salaryCategories) {
    assert.match(slugifyCategory(category), /^[a-z0-9-]+$/);
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
  for (const category of salaryCategories) {
    const my = salaryData.Malaysia[category].mid;
    const sg = salaryData.Singapore[category].mid;
    assert.ok(sg.min > my.min, `${category}: SGD mid floor should exceed MYR`);
  }
});
