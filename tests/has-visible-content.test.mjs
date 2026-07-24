import test from 'node:test';
import assert from 'node:assert/strict';

import { hasVisibleContent } from '../lib/sanitize.ts';

test('real content shows', () => {
  assert.equal(hasVisibleContent('<p>What this post covers.</p>'), true);
  assert.equal(hasVisibleContent('<ul><li>One</li><li>Two</li></ul>'), true);
  assert.equal(hasVisibleContent('<p><strong>Bold</strong> lede</p>'), true);
  // Legacy plain text, from before the field was rich text.
  assert.equal(hasVisibleContent('Just a sentence.'), true);
});

test('an editor emptied of text does not render a box', () => {
  // TinyMCE does not give back '' when the author clears the field.
  assert.equal(hasVisibleContent('<p></p>'), false);
  assert.equal(hasVisibleContent('<p>&nbsp;</p>'), false);
  assert.equal(hasVisibleContent('<p>&#160;</p>'), false);
  assert.equal(hasVisibleContent('<p><br></p>'), false);
  assert.equal(hasVisibleContent('<p>   </p>\n<p>&nbsp;</p>'), false);
  assert.equal(hasVisibleContent('<div><span></span></div>'), false);
});

test('missing values are not content', () => {
  assert.equal(hasVisibleContent(''), false);
  assert.equal(hasVisibleContent('   '), false);
  assert.equal(hasVisibleContent(null), false);
  assert.equal(hasVisibleContent(undefined), false);
});

test('media with no text still counts as something to show', () => {
  assert.equal(hasVisibleContent('<p><img src="/a.png" alt=""></p>'), true);
  assert.equal(hasVisibleContent('<iframe src="https://www.youtube.com/embed/x"></iframe>'), true);
});
