import { describe, it, expect, vi, beforeEach } from 'vitest';
import { safetyGuard } from './safetyGuard';
import { generateClinicalContent } from './aiService';

vi.mock('./aiService', () => ({
  generateClinicalContent: vi.fn(),
}));

describe('safetyGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('applyMdrBypass', () => {
    it('should sanitize direct diagnosis text and return modification log', () => {
      const input = 'Du hast einen Bandscheibenvorfall';
      const result = safetyGuard.applyMdrBypass(input);

      expect(result.sanitizedText).toBe('Die Befunde deuten auf Bandscheibenvorfall hin, verifiziert durch [Safety Guard MDR Filter]');
      expect(result.logs).toHaveLength(1);
      expect(result.logs[0]).toMatchObject({
        source: 'MDR-Filter',
        status: 'modified',
        reasoning: 'Direkte Diagnosestellung wurde verhindert (MDR Compliance).'
      });
    });

    it('should pass through text without diagnosis pattern', () => {
      const input = 'Bewegungseinschränkung in der LWS beobachtet';
      const result = safetyGuard.applyMdrBypass(input);

      expect(result.sanitizedText).toBe(input);
      expect(result.logs).toHaveLength(0);
    });
  });

  describe('validateHypothesis', () => {
    it('should process hypothesis successfully when AI response is valid', async () => {
      const mockAiResponse = {
        text: JSON.stringify({
          isSafe: true,
          reasoning: 'Entspricht Leitlinie X',
          recommendedFeedback: 'Guter Ansatz',
          guideline: 'JOSPT 2024',
          confidence: 0.9
        }),
        candidates: [
          {
            groundingMetadata: {
              groundingChunks: [
                { web: { uri: 'https://example.com/guideline' } }
              ]
            }
          }
        ]
      };

      vi.mocked(generateClinicalContent).mockResolvedValue(mockAiResponse as any);

      const addCotStep = vi.fn().mockReturnValue('step-1');
      const updateCotStep = vi.fn();

      const res = await safetyGuard.validateHypothesis('Patient hat LWS-Syndrom', addCotStep, updateCotStep);

      expect(addCotStep).toHaveBeenCalledWith(expect.objectContaining({
        phase: 'Evidenz-Mapping',
        status: 'active'
      }));

      expect(updateCotStep).toHaveBeenCalledWith('step-1', expect.objectContaining({
        description: 'Hypothese validiert gegen JOSPT 2024. Entspricht Leitlinie X',
        confidence: 0.9,
        status: 'complete',
        sources: [{ title: 'JOSPT 2024', url: 'https://example.com/guideline' }]
      }));

      expect(res.isSafe).toBe(true);
      expect(res.feedback).toBe('Guter Ansatz');
      expect(res.logs).toHaveLength(1);
      expect(res.logs[0].source).toBe('JOSPT 2024');
    });

    it('should trigger offline fallback and update CoT step on error in generateClinicalContent', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('API Rate limit exceeded or Network Failure');
      vi.mocked(generateClinicalContent).mockRejectedValue(error);

      const addCotStep = vi.fn().mockReturnValue('step-42');
      const updateCotStep = vi.fn();

      const hypothesis = 'Hypothese bezüglich Impingement-Syndrom';
      const res = await safetyGuard.validateHypothesis(hypothesis, addCotStep, updateCotStep);

      // Verify error was logged
      expect(consoleSpy).toHaveBeenCalledWith('Safety Guard Error:', error);

      // Verify updateCotStep was called with error details and offline fallback notice
      expect(updateCotStep).toHaveBeenCalledWith('step-42', {
        description: 'Fehler beim Abruf der Evidenz. Aktiviere Offline-Fallback.',
        status: 'error',
        confidence: 0
      });

      // Verify offline fallback response structure
      expect(res.isSafe).toBe(true);
      expect(res.feedback).toBe(hypothesis + ' (Offline Validierung)');
      expect(res.logs).toEqual([
        expect.objectContaining({
          source: 'Offline Fallback',
          status: 'approved',
          reasoning: 'Konnte nicht gegen Online-Leitlinien geprüft werden.'
        })
      ]);

      consoleSpy.mockRestore();
    });
  });
});
