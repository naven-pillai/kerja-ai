import test from 'node:test';
import assert from 'node:assert/strict';

import {
  experienceLevels,
  companyTypes,
  workArrangements,
  employmentTypes,
  industries,
  malaysianCities,
  salaryBounds,
  MAX_BONUS_MONTHS,
  isValidOption,
} from '../constants/salary-submission.ts';
import { subscriberCountries } from '../constants/newsletter-countries.ts';

const ALL_OPTION_SETS = [
  ['experienceLevels', experienceLevels],
  ['companyTypes', companyTypes],
  ['workArrangements', workArrangements],
  ['employmentTypes', employmentTypes],
  ['industries', industries],
];

test('option values are unique and URL/DB safe', () => {
  for (const [name, options] of ALL_OPTION_SETS) {
    const values = options.map((o) => o.value);
    assert.equal(new Set(values).size, values.length, `${name} has duplicate values`);
    for (const o of options) {
      assert.match(o.value, /^[a-z0-9+-]+$/, `${name}: "${o.value}" is not a safe value`);
      assert.ok(o.label.trim().length > 0, `${name}: "${o.value}" has no label`);
    }
  }
});

test('isValidOption accepts only listed values', () => {
  assert.ok(isValidOption(experienceLevels, '3-5'));
  assert.ok(isValidOption(industries, 'banking'));
  assert.ok(isValidOption(employmentTypes, 'permanent'));

  assert.ok(!isValidOption(experienceLevels, '4-7'));
  assert.ok(!isValidOption(industries, 'crypto'));
  // The API passes a string|null straight in — it must not throw or accept these.
  assert.ok(!isValidOption(industries, null));
  assert.ok(!isValidOption(industries, undefined));
  assert.ok(!isValidOption(industries, 42));
  assert.ok(!isValidOption(industries, ''));
});

test('salary bounds exist for every country we accept', () => {
  for (const country of subscriberCountries) {
    const b = salaryBounds[country];
    assert.ok(b, `no salary bounds for ${country}`);
    assert.ok(b.min > 0 && b.max > b.min, `${country} bounds are not a range`);
  }
});

test('bounds catch an annual figure typed into a monthly field', () => {
  // The most common way this data goes wrong.
  for (const country of subscriberCountries) {
    const { max } = salaryBounds[country];
    assert.ok(120_000 > max, `${country}: an annual salary should fall outside the monthly bound`);
  }
});

test('bounds still admit a genuinely senior salary', () => {
  // Rejecting a real lead-level figure would quietly bias the dataset downward.
  for (const country of subscriberCountries) {
    const { min, max } = salaryBounds[country];
    assert.ok(max >= 30_000, `${country}: ceiling too low for senior pay`);
    assert.ok(min <= 2_000, `${country}: floor too high for a junior salary`);
  }
});

test('no free-text city — the list is fixed', () => {
  assert.ok(malaysianCities.length > 5);
  assert.ok(malaysianCities.includes('Kuala Lumpur'));
  // Singapore is a city-state and must never appear as a Malaysian city.
  assert.ok(!malaysianCities.includes('Singapore'));
});

test('bonus cap is sane', () => {
  assert.ok(MAX_BONUS_MONTHS > 12 && MAX_BONUS_MONTHS <= 24);
});

test('no option set collects anything identifying', () => {
  // The anonymity guarantee is structural. If someone adds a "company name" or
  // "email" option set here, this fails.
  // Whole tokens only — a substring match flags "logistics" for containing "ic".
  const banned = /(^|[-_])(name|email|phone|ic|nric|passport|address)([-_]|$)/i;
  for (const [setName, options] of ALL_OPTION_SETS) {
    for (const o of options) {
      assert.ok(!banned.test(o.value), `${setName}: "${o.value}" looks identifying`);
    }
  }
});
