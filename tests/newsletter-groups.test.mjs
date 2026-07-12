import test from 'node:test';
import assert from 'node:assert/strict';

import {
  newsletterGroups,
  newsletterGroupSlugs,
  isNewsletterGroupSlug,
  groupsForJobCategory,
  categoriesWithoutGroup,
} from '../constants/newsletter-groups.ts';
import { jobCategories } from '../constants/job-filters.ts';

test('every job category maps to at least one newsletter group', () => {
  // If a category falls through, jobs in it would never appear in ANY digest —
  // silently, with nothing to notice.
  assert.deepEqual(categoriesWithoutGroup(jobCategories), [], 'these job categories reach no group');
});

test('groups only reference real job categories', () => {
  for (const group of newsletterGroups) {
    for (const category of group.jobCategories) {
      assert.ok(
        jobCategories.includes(category),
        `group "${group.slug}" references unknown job category "${category}"`
      );
    }
  }
});

test('group slugs are unique', () => {
  assert.equal(new Set(newsletterGroupSlugs).size, newsletterGroupSlugs.length);
});

test('a job category routes to the expected group', () => {
  assert.deepEqual(groupsForJobCategory('AI Engineering'), ['ai-ml-engineering']);
  assert.deepEqual(groupsForJobCategory('Data Science'), ['data-science-research']);
  assert.deepEqual(groupsForJobCategory('NLP Engineering'), ['applied-ai']);
  assert.deepEqual(groupsForJobCategory('Data Annotation'), ['data-engineering']);
});

test('an unknown job category routes nowhere (rather than defaulting)', () => {
  assert.deepEqual(groupsForJobCategory('Underwater Basket Weaving'), []);
});

test('slug validation rejects anything not in the list', () => {
  assert.ok(isNewsletterGroupSlug('ai-ml-engineering'));
  assert.ok(!isNewsletterGroupSlug('cat-marketing'));
  assert.ok(!isNewsletterGroupSlug(''));
  assert.ok(!isNewsletterGroupSlug(null));
  assert.ok(!isNewsletterGroupSlug(123));
});
