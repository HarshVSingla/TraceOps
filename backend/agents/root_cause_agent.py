import json

from backend.clients.azure_openai_client import ask_gpt


class RootCauseAgent:

    def analyze(self, log_evidence, deployment_evidence, knowledge_evidence, prior_feedback=None):

        evidence = {
            "logs": log_evidence,
            "deployment": deployment_evidence,
            "knowledge": knowledge_evidence
        }

        feedback_section = ""

        if prior_feedback:
            feedback_section = f"""
A PREVIOUS ATTEMPT at diagnosing this incident was judged incorrect or
incomplete. Use this feedback to reconsider your analysis, but still
follow all STRICT RULES below — do not invent facts not present in the
evidence just to satisfy the feedback.

Previous attempt's stated root cause:
{prior_feedback.get("previous_root_cause", "")}

Why it was judged incorrect/incomplete:
{prior_feedback.get("reasoning", "")}

Re-examine the evidence below with this in mind. If the evidence genuinely
supports a different or more specific cause, state it. If the evidence is
simply insufficient to go further, say so and keep confidence "low" rather
than guessing.
"""

        prompt = f"""
You are the Root Cause Agent in TraceOps, a software incident investigation system.

Analyze ONLY the evidence provided below.
{feedback_section}

STRICT RULES:
1. Use only facts explicitly present in the evidence.
2. Do not invent, assume, or infer specific technical details that are not provided.
3. Do not introduce facts from your general knowledge.
4. Every item in the "evidence" array must be directly supported by the supplied evidence.
5. The root cause must be stated as a conclusion based on the supplied evidence.
6. If multiple causes are possible, say so instead of pretending certainty.
7. If the evidence is insufficient, set confidence to "low" and clearly explain why.
8. The recommended fix must use only actions supported by the supplied evidence.
9. Do not add specific configuration values, parameter names, infrastructure details, or operational steps unless they appear in the evidence.
10. human_approval_required must always be true.
11. verification_steps must contain practical checks supported by the supplied evidence.
12. Do not recommend destructive or irreversible actions as completed actions.
13. Verification steps must be completed and reviewed by a human before applying fixes.

Confidence rules:
- high: The root cause is directly established by multiple independent
  pieces of evidence, such as confirmed configuration failures, explicit
  error messages identifying the cause, or verified remediation results.
- medium: Multiple pieces of evidence support a likely cause, but the
  underlying cause has not been directly verified.
- low: Evidence is insufficient, conflicting, or supports only symptoms
  without establishing a likely cause.

The verification_steps field must explain how a human can validate the suspected cause using only the supplied evidence and documented troubleshooting guidance.
Causation rules:
- Do not claim that a deployment caused an incident solely because the
  incident occurred after the deployment.
- When a deployment change matches the incident symptoms, describe it as
  a likely contributing cause unless the evidence directly confirms
  causation.
- Clearly distinguish observed facts, likely causes, and unverified
  hypotheses.
- If the evidence establishes symptoms but not the underlying cause,
  state that limitation explicitly.

Return ONLY valid JSON.
Do not use Markdown.
Do not include ```json fences.

Use exactly this structure:

{{
    "incident_summary": "string",
    "root_cause": "string",
    "confidence": "high | medium | low",
    "evidence": [
        "string"
    ],
    "recommended_fix": "string",
    "verification_steps": [
        "string"
    ],
    "human_approval_required": true
}}

Evidence:

{json.dumps(evidence, indent=2)}
"""

        response = ask_gpt(prompt)

        try:
            result = json.loads(response)
        except json.JSONDecodeError:
            result = {
                "incident_summary": "Unable to generate a structured incident analysis.",
                "root_cause": response,
                "confidence": "low",
                "evidence": [],
                "recommended_fix": "Review the investigation evidence manually.",
                "human_approval_required": True
            }

        return result


if __name__ == "__main__":

    log_evidence = {
        "status": "success",
        "total_logs": 7,
        "error_count": 5,
        "errors": [
            "database connection timeout",
            "database connection timeout",
            "request took 5000ms",
            "database connection timeout",
            "request took 5100ms"
        ]
    }

    deployment_evidence = {
        "status": "success",
        "service": "payment-api",
        "latest_version": "v2.4.0",
        "deployment_time": "2026-09-16T08:45:00",
        "changes": [
            "Changed database connection pool configuration",
            "Updated database timeout settings"
        ]
    }

    knowledge_evidence = {
        "status": "success",
        "keyword": "database connection",
        "matches": [
            {
                "file": "previous_incidents.md",
                "content": "Previous incident involved database connection pool configuration."
            },
            {
                "file": "troubleshooting.md",
                "content": "Check database connection pool and timeout settings."
            }
        ]
    }

    agent = RootCauseAgent()

    result = agent.analyze(
        log_evidence,
        deployment_evidence,
        knowledge_evidence
    )

    print("\n===== TRACEOPS AI ROOT CAUSE ANALYSIS =====")

    print("\nIncident Summary:")
    print(result["incident_summary"])

    print("\nRoot Cause:")
    print(result["root_cause"])

    print("\nConfidence:")
    print(result["confidence"])

    print("\nEvidence:")
    for evidence in result["evidence"]:
        print("-", evidence)

    print("\nRecommended Fix:")
    print(result["recommended_fix"])

    print("\nHuman Approval Required:")
    print(result["human_approval_required"])