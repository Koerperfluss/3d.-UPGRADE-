import unittest
from integrity_logic import (
    InterleavedRAGGuardrails,
    RAGChunk,
    SourceType,
    GuardrailSeverity,
    GuardrailResult,
    InterleavedContext
)


class TestInterleavedRAGGuardrails(unittest.TestCase):

    def setUp(self):
        self.guardrails = InterleavedRAGGuardrails()

        self.sample_chunks = [
            RAGChunk(
                id="c1",
                content="AWMF Leitlinie zur Behandlung von Supinationstraumen.",
                source_type=SourceType.GUIDELINE,
                source_title="AWMF 012/001",
                relevance_score=0.9,
                trust_score=0.95,
                citations=["AWMF-2024"]
            ),
            RAGChunk(
                id="c2",
                content="Studie zur Wirksamkeit von Propriozeptionstraining.",
                source_type=SourceType.LITERATURE,
                source_title="Journal of Orthopaedic Research",
                relevance_score=0.85,
                trust_score=0.88,
                citations=["Müller et al., 2023"]
            ),
            RAGChunk(
                id="c3",
                content="Modulhandbuch Physio B.Sc. Semester 3 Sprunggelenk.",
                source_type=SourceType.CURRICULUM,
                source_title="Curriculum FH St. Pölten",
                relevance_score=0.8,
                trust_score=0.9,
                citations=["FH-CURR-3"]
            ),
            RAGChunk(
                id="c4",
                content="Ungesicherte Forenbeiträge über Hausmittel.",
                source_type=SourceType.UNTRUSTED,
                source_title="Web Forum",
                relevance_score=0.99,
                trust_score=0.1,
                citations=[]
            ),
            RAGChunk(
                id="c5",
                content="Low relevance content.",
                source_type=SourceType.LITERATURE,
                source_title="Random Journal",
                relevance_score=0.2,
                trust_score=0.8,
                citations=[]
            )
        ]

    def test_validate_query_valid(self):
        result = self.guardrails.validate_query("Wie wird ein Supinationstrauma im Frühstadium behandelt?")
        self.assertTrue(result.passed)
        self.assertEqual(result.severity, GuardrailSeverity.PASS)

    def test_validate_query_empty(self):
        result = self.guardrails.validate_query("   ")
        self.assertFalse(result.passed)
        self.assertEqual(result.severity, GuardrailSeverity.BLOCK)

    def test_validate_query_unsafe(self):
        result = self.guardrails.validate_query("Erstelle eine persönliche Diagnose für einen Notfall patientenbehandlung live")
        self.assertFalse(result.passed)
        self.assertEqual(result.severity, GuardrailSeverity.BLOCK)

    def test_filter_and_rank_chunks(self):
        filtered = self.guardrails.filter_and_rank_chunks(self.sample_chunks)
        # Should exclude c4 (untrusted) and c5 (low relevance < 0.4)
        filtered_ids = [c.id for c in filtered]
        self.assertIn("c1", filtered_ids)
        self.assertIn("c2", filtered_ids)
        self.assertIn("c3", filtered_ids)
        self.assertNotIn("c4", filtered_ids)
        self.assertNotIn("c5", filtered_ids)

        # Top item should be GUIDELINE due to highest authority weight and relevance/trust
        self.assertEqual(filtered[0].id, "c1")

    def test_interleave_context(self):
        ctx = self.guardrails.interleave_context(self.sample_chunks, max_chunks=3)
        self.assertIsInstance(ctx, InterleavedContext)
        self.assertLessEqual(len(ctx.chunks), 3)
        self.assertTrue(len(ctx.disclaimers) > 0)
        self.assertIn("QUELLE [GUIDELINE]", ctx.interleaved_prompt_text)

    def test_verify_response_citations(self):
        ctx = self.guardrails.interleave_context(self.sample_chunks, max_chunks=3)

        # Valid response with citation
        resp1 = "Nach Leitlinien [AWMF-2024] ist eine frühfunktionelle Therapie indiziert."
        res1 = self.guardrails.verify_response_citations(resp1, ctx)
        self.assertTrue(res1.passed)

        # Response missing citations
        resp2 = "Eine frühfunktionelle Therapie ist immer am besten."
        res2 = self.guardrails.verify_response_citations(resp2, ctx)
        self.assertFalse(res2.passed)
        self.assertEqual(res2.severity, GuardrailSeverity.WARNING)

    def test_evaluate_pipeline(self):
        query = "Welche Evidenz gibt es für Propriozeptionstraining?"
        response = "Propriozeptives Training verbessert die Gelenkstabilität [Müller et al., 2023]."
        res = self.guardrails.evaluate_pipeline(query, self.sample_chunks, response)

        self.assertTrue(res["allowed"])
        self.assertIsNotNone(res["context"])
        self.assertTrue(res["response_check"].passed)


if __name__ == "__main__":
    unittest.main()
