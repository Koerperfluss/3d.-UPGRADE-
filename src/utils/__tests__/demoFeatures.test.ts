import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { openOptimizedLink, simulateLmsExport, downloadAsPdf, SHOWCASE_CASES } from '../demoFeatures';

describe('demoFeatures utils', () => {
  const originalUserAgent = navigator.userAgent;
  const originalLocation = window.location;
  const originalOpen = window.open;
  const originalPrint = window.print;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      configurable: true,
      writable: true,
    });
    window.open = originalOpen;
    window.print = originalPrint;
  });

  describe('openOptimizedLink', () => {
    it('uses window.location.assign when in Safari Technology Preview standalone mode', () => {
      // Mock userAgent for Safari TP
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15 Preview/22625',
        configurable: true,
        writable: true,
      });

      // Mock window.navigator.standalone = true
      Object.defineProperty(window.navigator, 'standalone', {
        value: true,
        configurable: true,
        writable: true,
      });

      const assignMock = vi.fn();
      Object.defineProperty(window, 'location', {
        value: { assign: assignMock },
        configurable: true,
        writable: true,
      });

      const testUrl = 'https://example.com/pwa';
      openOptimizedLink(testUrl);

      expect(assignMock).toHaveBeenCalledWith(testUrl);
      expect(assignMock).toHaveBeenCalledTimes(1);
    });

    it('uses window.open when in Safari Technology Preview but NOT standalone mode', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15 Preview/22625',
        configurable: true,
        writable: true,
      });

      Object.defineProperty(window.navigator, 'standalone', {
        value: false,
        configurable: true,
        writable: true,
      });

      const openMock = vi.fn();
      window.open = openMock;

      const testUrl = 'https://example.com/normal';
      openOptimizedLink(testUrl);

      expect(openMock).toHaveBeenCalledWith(testUrl, '_blank', 'noopener,noreferrer');
      expect(openMock).toHaveBeenCalledTimes(1);
    });

    it('uses window.open for standard Chrome/Firefox/Safari browsers', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        configurable: true,
        writable: true,
      });

      const openMock = vi.fn();
      window.open = openMock;

      const testUrl = 'https://example.com/standard';
      openOptimizedLink(testUrl);

      expect(openMock).toHaveBeenCalledWith(testUrl, '_blank', 'noopener,noreferrer');
      expect(openMock).toHaveBeenCalledTimes(1);
    });

    it('uses window.open if standalone is undefined even on Safari TP', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Safari Preview 123',
        configurable: true,
        writable: true,
      });

      // standalone property missing or undefined
      delete (window.navigator as any).standalone;

      const openMock = vi.fn();
      window.open = openMock;

      const testUrl = 'https://example.com/nostandalone';
      openOptimizedLink(testUrl);

      expect(openMock).toHaveBeenCalledWith(testUrl, '_blank', 'noopener,noreferrer');
      expect(openMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('simulateLmsExport', () => {
    it('simulates LMS export and resolves true after delay', async () => {
      vi.useFakeTimers();
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const exportPromise = simulateLmsExport('Anatomie 101');
      vi.advanceTimersByTime(1500);

      const result = await exportPromise;
      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith('Exportiere Daten von Anatomie 101 nach Moodle...');

      vi.useRealTimers();
    });
  });

  describe('downloadAsPdf', () => {
    it('triggers window.print()', () => {
      const printMock = vi.fn();
      window.print = printMock;

      downloadAsPdf();

      expect(printMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('SHOWCASE_CASES', () => {
    it('contains expected clinical showcase cases data structure', () => {
      expect(SHOWCASE_CASES.LWS_ANAMNESE).toBeDefined();
      expect(SHOWCASE_CASES.LWS_ANAMNESE.title).toContain('LWS-Stabilität');
      expect(SHOWCASE_CASES.GANGANALYSE_VALGUS.findings).toHaveLength(3);
    });
  });
});
