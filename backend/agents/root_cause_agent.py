import json

from backend.clients.azure_openai_client import ask_gpt


class RootCauseAgent:

    def analyze(self, log_evidence, deployment_evidence, knowledge_evidence):

        evidence = {
            "logs": log_evidence,
            "deployment": deployment_evidence,
            "knowledge": knowledge_evidence
        }

        prompt = f"""
You are the Root Cause Agent in TraceOps, a software incident investigation system.

Analyze ONLY the evidence provided below.

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

Confidence rules:
- high: Multiple pieces of evidence directly support the same root cause.
- medium: Evidence suggests a likely cause but does not strongly establish it.
- low: Evidence is insufficient or conflicting.

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