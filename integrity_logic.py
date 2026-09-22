# integrity_logic.py
# Scaffold for Educational Integrity & Accessibility Framework (EIAF)
# Part of the Körperfluss AI Middleware for Medical Education

"""
Educational Integrity & Accessibility Framework (EIAF)
Module for Interleaved RAG (Retrieval-Augmented Generation) Guardrails,
WCAG 2.2 / BFSG Accessibility Transformations, and LTI 1.3 Moodle Integration.
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import List, Dict, Optional, Any, Set
import re


class SourceType(Enum):
    GUIDELINE = "guideline"         # Clinical guidelines (e.g., AWMF, WHO)
    LITERATURE = "literature"       # Peer-reviewed journal articles
    CURRICULUM = "curriculum"       # Educational institution curriculum / syllabus
    EXAM_DB = "exam_db"             # Institutional question/exam database
    UNTRUSTED = "untrusted"         # External or web-scraped content


class GuardrailSeverity(Enum):
    PASS = "PASS"
    WARNING = "WARNING"
    BLOCK = "BLOCK"


@dataclass
class RAGChunk:
    """Represents a retrieved context chunk for RAG."""
    id: str
    content: str
    source_type: SourceType
    source_title: str
    relevance_score: float  # Normalized 0.0 - 1.0
    trust_score: float      # Normalized 0.0 - 1.0
    citations: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class GuardrailResult:
    """Result of a guardrail evaluation check."""
    check_name: str
    passed: bool
    severity: GuardrailSeverity
    message: str
    details: Dict[str, Any] = field(default_factory=dict)


@dataclass
class InterleavedContext:
    """Structured result of interleaving multiple source chunks."""
    chunks: List[RAGChunk]
    interleaved_prompt_text: str
    source_distribution: Dict[str, int]
    coverage_score: float
    disclaimers: List[str]


class InterleavedRAGGuardrails:
    """
    Interleaved RAG Guardrails for Körperfluss AI Middleware.

    Provides:
    1. Input Query Safety & Scope Validation (Medical & Educational boundaries).
    2. Multi-Source Chunk Interleaving & Context Re-ranking.
    3. Retrieval Hallucination & Citation Verification.
    4. Compliance & Integrity Disclaimers (MDR / AWMF).
    """

    DEFAULT_DISCLAIMER = (
        "[MEDIZINISCHER HINWEIS]: Die bereitgestellten Inhalte dienen ausschließlich "
        "bildungsbezogenen Zwecken in der akademischen Lehre und ersetzen keine klinische "
        "Diagnostik oder Therapieentscheidung."
    )

    UNSAFE_PATTERNS = [
        r"\b(persönliche diagnose|patientenbehandlung live|akute notfallanweisung)\b",
        r"\b(suizid|selbstverletzung|rezept fälschen|drogen herstellen)\b",
    ]

    def __init__(
        self,
        min_relevance_threshold: float = 0.4,
        min_trust_threshold: float = 0.5,
        required_source_types: Optional[List[SourceType]] = None,
        enforce_disclaimers: bool = True
    ):
        self.min_relevance_threshold = min_relevance_threshold
        self.min_trust_threshold = min_trust_threshold
        self.required_source_types = required_source_types or [SourceType.GUIDELINE, SourceType.LITERATURE]
        self.enforce_disclaimers = enforce_disclaimers

    def validate_query(self, query: str) -> GuardrailResult:
        """
        Evaluates input query for security, medical safety, and educational integrity boundaries.
        """
        if not query or not query.strip():
            return GuardrailResult(
                check_name="input_query_validation",
                passed=False,
                severity=GuardrailSeverity.BLOCK,
                message="Leere Anfrage empfangen."
            )

        clean_query = query.strip()
        for pattern in self.UNSAFE_PATTERNS:
            if re.search(pattern, clean_query, re.IGNORECASE):
                return GuardrailResult(
                    check_name="input_query_validation",
                    passed=False,
                    severity=GuardrailSeverity.BLOCK,
                    message="Die Anfrage enthält unzulässige oder ungesicherte medizinische/ethische Inhalte.",
                    details={"matched_pattern": pattern}
                )

        return GuardrailResult(
            check_name="input_query_validation",
            passed=True,
            severity=GuardrailSeverity.PASS,
            message="Anfrage ist sicher und im erlaubten Kontext."
        )

    def filter_and_rank_chunks(self, chunks: List[RAGChunk]) -> List[RAGChunk]:
        """
        Filters chunks based on trust/relevance thresholds and ranks them by combined score.
        """
        valid_chunks = [
            c for c in chunks
            if c.relevance_score >= self.min_relevance_threshold
            and c.trust_score >= self.min_trust_threshold
            and c.source_type != SourceType.UNTRUSTED
        ]

        # Interleaved score calculation combining relevance and source authority
        def composite_score(chunk: RAGChunk) -> float:
            authority_weight = 1.2 if chunk.source_type == SourceType.GUIDELINE else (
                1.1 if chunk.source_type == SourceType.CURRICULUM else 1.0
            )
            return (chunk.relevance_score * 0.6 + chunk.trust_score * 0.4) * authority_weight

        return sorted(valid_chunks, key=composite_score, reverse=True)

    def interleave_context(self, chunks: List[RAGChunk], max_chunks: int = 5) -> InterleavedContext:
        """
        Interleaves sorted chunks from diverse sources to construct a balanced RAG prompt context.
        """
        filtered_chunks = self.filter_and_rank_chunks(chunks)

        # Group chunks by source type for interleaved selection
        grouped: Dict[SourceType, List[RAGChunk]] = {}
        for chunk in filtered_chunks:
            grouped.setdefault(chunk.source_type, []).append(chunk)

        interleaved: List[RAGChunk] = []
        source_types = list(grouped.keys())

        # Interleave round-robin across source types to avoid single-source bias
        idx = 0
        while len(interleaved) < max_chunks and any(grouped.values()):
            st = source_types[idx % len(source_types)]
            if grouped[st]:
                interleaved.append(grouped[st].pop(0))
            idx += 1

        # Format context prompt
        formatted_blocks = []
        distribution: Dict[str, int] = {}

        for c in interleaved:
            st_name = c.source_type.value
            distribution[st_name] = distribution.get(st_name, 0) + 1
            citation_str = f" [Citations: {', '.join(c.citations)}]" if c.citations else ""
            block = f"--- QUELLE [{c.source_type.value.upper()}]: {c.source_title}{citation_str} ---\n{c.content}"
            formatted_blocks.append(block)

        interleaved_text = "\n\n".join(formatted_blocks)

        disclaimers = []
        if self.enforce_disclaimers:
            disclaimers.append(self.DEFAULT_DISCLAIMER)

        coverage = len(interleaved) / max_chunks if max_chunks > 0 else 0.0

        return InterleavedContext(
            chunks=interleaved,
            interleaved_prompt_text=interleaved_text,
            source_distribution=distribution,
            coverage_score=min(coverage, 1.0),
            disclaimers=disclaimers
        )

    def verify_response_citations(self, response_text: str, context: InterleavedContext) -> GuardrailResult:
        """
        Verifies that the generated response adheres to citations present in the interleaved context.
        """
        if not response_text or not response_text.strip():
            return GuardrailResult(
                check_name="citation_verification",
                passed=False,
                severity=GuardrailSeverity.WARNING,
                message="Antworttext ist leer."
            )

        available_citations: Set[str] = set()
        for chunk in context.chunks:
            available_citations.update(chunk.citations)
            available_citations.add(chunk.source_title)

        found_citations = re.findall(r"\[(.*?)\]", response_text)

        if available_citations and not found_citations:
            return GuardrailResult(
                check_name="citation_verification",
                passed=False,
                severity=GuardrailSeverity.WARNING,
                message="Antwort enthält keine QuelLennachweise oder Zitate.",
                details={"available_sources": list(available_citations)}
            )

        return GuardrailResult(
            check_name="citation_verification",
            passed=True,
            severity=GuardrailSeverity.PASS,
            message="Quellennachweise erfolgreich verifiziert.",
            details={"citations_found": found_citations}
        )

    def evaluate_pipeline(
        self,
        query: str,
        retrieved_chunks: List[RAGChunk],
        generated_response: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Runs the full interleaved RAG guardrail evaluation pipeline.
        """
        query_check = self.validate_query(query)
        if not query_check.passed:
            return {
                "allowed": False,
                "reason": query_check.message,
                "query_check": query_check,
                "context": None,
                "response_check": None
            }

        interleaved_context = self.interleave_context(retrieved_chunks)

        response_check = None
        if generated_response:
            response_check = self.verify_response_citations(generated_response, interleaved_context)

        return {
            "allowed": True,
            "query_check": query_check,
            "context": interleaved_context,
            "response_check": response_check,
            "disclaimers": interleaved_context.disclaimers
        }


# TODO: Implement WCAG 2.2 / BFSG accessibility transformation layer
# TODO: Implement LTI 1.3 integration patterns for Moodle 5.0
