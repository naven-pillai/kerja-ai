import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Salary and currency have to be fetched together.
 *
 * formatSalaryRange deliberately renders bare numbers when it gets no currency,
 * so a query that selects min_salary/max_salary but forgets currency does not
 * error — it silently prints "149,000" where it should print "RM149,000". That
 * is exactly what the company page did.
 *
 * Scans source rather than mocking Supabase: the bug lives in the select string.
 */
function sourceFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.next') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, acc);
    else if (/\.(ts|tsx)$/.test(entry)) acc.push(full);
  }
  return acc;
}

/** The `.select(`...`)` blocks in a file, as raw strings. */
function selectBlocks(source) {
  return [...source.matchAll(/\.select\(\s*`([^`]*)`/g)].map((m) => m[1]);
}

test('every jobs query that selects a salary also selects currency', () => {
  const offenders = [];

  for (const file of [...sourceFiles('app'), ...sourceFiles('components')]) {
    const source = readFileSync(file, 'utf8');
    if (!source.includes("from('jobs')")) continue;

    for (const block of selectBlocks(source)) {
      const fields = block.split(',').map((f) => f.trim());
      const hasSalary = fields.some((f) => f === 'min_salary' || f === 'max_salary');
      const hasCurrency = fields.includes('currency');
      if (hasSalary && !hasCurrency) offenders.push(file);
    }
  }

  assert.deepEqual(
    offenders,
    [],
    `these fetch a salary without its currency, so the card renders no symbol:\n  ${offenders.join('\n  ')}`
  );
});
