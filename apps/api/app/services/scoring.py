from dataclasses import dataclass

from app.models.attention_economics import AttentionEconomics
from app.models.evaluation import Evaluation

# Weights for each lens
LENS_WEIGHTS = {
    "user": 0.25,
    "buyer": 0.20,
    "attention": 0.20,
    "workflow": 0.20,
    "timing": 0.15,
}

ATTENTION_ECONOMICS_WEIGHT = 0.15
EVALUATION_WEIGHT = 0.85

PROCEED_THRESHOLD = 7.0
KILL_THRESHOLD = 4.0


@dataclass
class ScoreBreakdown:
    lens_scores: dict[str, float]
    weighted_evaluation_score: float
    attention_ratio_score: float
    composite_score: float
    recommendation: str  # proceed / revise / kill


def compute_idea_score(
    evaluations: list[Evaluation],
    attention: AttentionEconomics | None,
) -> ScoreBreakdown:
    lens_scores: dict[str, float] = {}
    for ev in evaluations:
        lens_scores[ev.lens.value if hasattr(ev.lens, "value") else ev.lens] = ev.score

    # Weighted evaluation score (0-10 scale)
    total_weight = 0.0
    weighted_sum = 0.0
    for lens, weight in LENS_WEIGHTS.items():
        if lens in lens_scores:
            weighted_sum += lens_scores[lens] * weight
            total_weight += weight

    weighted_eval = (weighted_sum / total_weight) if total_weight > 0 else 0.0

    attention_ratio = attention.ratio_score if attention else 0.0

    composite = (EVALUATION_WEIGHT * weighted_eval) + (ATTENTION_ECONOMICS_WEIGHT * attention_ratio * 10)

    if composite >= PROCEED_THRESHOLD:
        recommendation = "proceed"
    elif composite <= KILL_THRESHOLD:
        recommendation = "kill"
    else:
        recommendation = "revise"

    return ScoreBreakdown(
        lens_scores=lens_scores,
        weighted_evaluation_score=round(weighted_eval, 4),
        attention_ratio_score=round(attention_ratio, 4),
        composite_score=round(composite, 4),
        recommendation=recommendation,
    )
