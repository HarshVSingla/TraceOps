import json

from backend.clients.azure_openai_client import ask_gpt


class VerificationAgent:

    def verify(self, ground_truth_root_cause, diagnosed_root_cause):

        prompt = f"""
You are the Verification Agent in TraceOps, a software incident
investigation training system.

You are comparing two descriptions of the root cause of the SAME
simulated incident:

1. GROUND_TRUTH: the actual, hidden cause used to generate the incident.
2. DIAGNOSIS: the root cause an investigating AI system concluded,
   using only observable evidence (logs, deployment data, docs).

Judge whether DIAGNOSIS correctly identifies the same underlying
cause as GROUND_TRUTH, even if worded differently.

Rules:
1. Focus on the underlying technical mechanism, not exact wording.
2. If DIAGNOSIS names the same cause as GROUND_TRUTH, even with
   different phrasing or extra caveats, judge it "correct".
3. If DIAGNOSIS is related but only identifies a symptom, or is
   missing a key specific detail, judge it "partial".
4. If DIAGNOSIS names a different, unrelated cause, judge it
   "incorrect".
5. Be strict about the CORE mechanism (e.g. "connection pool
   exhaustion" vs "readonly replica misroute" are DIFFERENT causes,
   even though both are database issues).
6. Ignore hedging/confidence language - judge only the substance.

GROUND_TRUTH:
{ground_truth_root_cause}

DIAGNOSIS:
{diagnosed_root_cause}

Return ONLY valid JSON, no markdown, no fences:

{{
  "match": "correct | partial | incorrect",
  "reasoning": "string - one or two sentences explaining the judgment"
}}
"""

        response = ask_gpt(prompt)

        try:
            result = json.loads(response)
        except json.JSONDecodeError:
            result = {
                "match": "incorrect",
                "reasoning": (
                    "Verification Agent did not return valid JSON; "
                    "treating as unverified."
                )
            }

        return result