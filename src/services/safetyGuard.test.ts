import { describe, it, expect } from 'vitest';
import { safetyGuard } from './safetyGuard';

describe('safetyGuard.applyMdrBypass', () => {
  it('returns unchanged text and empty logs when no diagnosis pattern is present', () => {
    const input = 'Der Patient zeigt Schmerzen im unteren Rücken bei Flexion.';
    const result = safetyGuard.applyMdrBypass(input);

    expect(result.sanitizedText).toBe(input);
    expect(result.logs).toEqual([]);
  });

  it('sanitizes text starting with "Du hast" and creates a validation log', () => {
    const input = 'Du hast einen Bandscheibenvorfall.';
    const result = safetyGuard.applyMdrBypass(input);

    expect(result.sanitizedText).toBe('Die Befunde deuten auf Bandscheibenvorfall hin, verifiziert durch [Safety Guard MDR Filter].');
    expect(result.logs).toHaveLength(1);
    expect(result.logs[0]).toMatchObject({
      source: 'MDR-Filter',
      status: 'modified',
      reasoning: 'Direkte Diagnosestellung wurde verhindert (MDR Compliance).'
    });
    expect(typeof result.logs[0].timestamp).toBe('string');
  });

  it('sanitizes text starting with "Sie haben"', () => {
    const input = 'Sie haben eine Lumbalgie';
    const result = safetyGuard.applyMdrBypass(input);

    expect(result.sanitizedText).toBe('Die Befunde deuten auf Lumbalgie hin, verifiziert durch [Safety Guard MDR Filter]');
    expect(result.logs).toHaveLength(1);
  });

  it('sanitizes text starting with "Die Diagnose ist"', () => {
    const input = 'Die Diagnose ist ein Impingement-Syndrom';
    const result = safetyGuard.applyMdrBypass(input);

    expect(result.sanitizedText).toBe('Die Befunde deuten auf Impingement-Syndrom hin, verifiziert durch [Safety Guard MDR Filter]');
    expect(result.logs).toHaveLength(1);
  });

  it('sanitizes text starting with "Es handelt sich um"', () => {
    const input = 'Es handelt sich um eine Patellasehnenreizung';
    const result = safetyGuard.applyMdrBypass(input);

    expect(result.sanitizedText).toBe('Die Befunde deuten auf Patellasehnenreizung hin, verifiziert durch [Safety Guard MDR Filter]');
    expect(result.logs).toHaveLength(1);
  });

  it('handles case-insensitive diagnosis triggers', () => {
    const input = 'du hast ein HWS-Syndrom';
    const result = safetyGuard.applyMdrBypass(input);

    expect(result.sanitizedText).toBe('Die Befunde deuten auf HWS-Syndrom hin, verifiziert durch [Safety Guard MDR Filter]');
    expect(result.logs).toHaveLength(1);
  });

  it('handles empty string gracefully', () => {
    const result = safetyGuard.applyMdrBypass('');

    expect(result.sanitizedText).toBe('');
    expect(result.logs).toEqual([]);
  });
});
