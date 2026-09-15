import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { simulateLmsExport } from './demoFeatures';

describe('simulateLmsExport', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should log exporting message with module name', () => {
    simulateLmsExport('Anatomie');
    expect(console.log).toHaveBeenCalledWith('Exportiere Daten von Anatomie nach Moodle...');
  });

  it('should resolve to true after 1500ms delay', async () => {
    const promise = simulateLmsExport('Physiologie');

    // Fast-forward time before resolution
    vi.advanceTimersByTime(1499);

    let resolved = false;
    promise.then(() => {
      resolved = true;
    });

    // Promise should not be resolved yet
    await Promise.resolve(); // flush microtasks
    expect(resolved).toBe(false);

    // Fast forward remaining 1ms
    vi.advanceTimersByTime(1);
    await promise;

    const result = await promise;
    expect(result).toBe(true);
  });

  it('should handle empty module name string', async () => {
    const promise = simulateLmsExport('');
    expect(console.log).toHaveBeenCalledWith('Exportiere Daten von  nach Moodle...');

    vi.advanceTimersByTime(1500);
    const result = await promise;
    expect(result).toBe(true);
  });
});
