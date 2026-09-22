import { describe, it, expect } from 'vitest';
import DOMPurify from 'dompurify';

describe('EducatorWorkspacePage XSS Sanitization', () => {
  it('sanitizes malicious XSS script tags in rubric content line', () => {
    const maliciousLine = 'Normal text **bold text** <script>alert("xss")</script><img src=x onerror=alert(1)>';
    const formattedLine = maliciousLine.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#C9A84C]">$1</strong>');
    const sanitizedHtml = DOMPurify.sanitize(formattedLine);

    expect(sanitizedHtml).not.toContain('<script>');
    expect(sanitizedHtml).not.toContain('onerror');
    expect(sanitizedHtml).toContain('<strong class="text-[#C9A84C]">bold text</strong>');
  });
});
