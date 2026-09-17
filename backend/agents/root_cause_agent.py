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

Analyze the evidence provided below.

Your job is to:
1. Identify the most likely root cause.
2. Assign a confidence level: high, medium, or low.
3. List the specific evidence supporting the conclusion.
4. Recommend a practical fix.
5. Do not invent facts that are not present in the evidence.
6. If the evidence is insufficient, clearly say so.

Return ONLY valid JSON in exactly this structure:

{{
    "root_cause": "string",
    "confidence": "high | medium | low",
    "evidence": [
        "string",
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