import { describe, it, expect } from 'vitest';
import DOMPurify from 'dompurify';

describe('BlogPostPage HTML Sanitization', () => {
  it('sanitizes malicious script tags and event handlers in post content', () => {
    const maliciousContent = '<p>Hello World</p><script>alert("xss")</script><img src="x" onerror="alert(1)">';
    const sanitized = DOMPurify.sanitize(maliciousContent);

    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('onerror');
    expect(sanitized).toContain('<p>Hello World</p>');
    expect(sanitized).toContain('<img src="x">');
  });
});
