class RootCauseAgent:

    def analyze(self, log_evidence, deployment_evidence, knowledge_evidence):

        findings = []

        # Check log evidence
        if log_evidence["error_count"] > 0:
            findings.append(
                "Multiple errors were detected in the application logs."
            )

        # Check deployment evidence
        deployment_changes = deployment_evidence.get("changes", [])

        pool_change = any(
            "connection pool" in change.lower()
            for change in deployment_changes
        )

        timeout_change = any(
            "timeout" in change.lower()
            for change in deployment_changes
        )

        if pool_change:
            findings.append(
                "The latest deployment changed the database connection pool configuration."
            )

        if timeout_change:
            findings.append(
                "The latest deployment changed database timeout settings."
            )

        # Check previous incidents
        knowledge_matches = knowledge_evidence.get("matches", [])

        previous_incident_found = any(
            "previous" in match["file"].lower()
            for match in knowledge_matches
        )

        if previous_incident_found:
            findings.append(
                "A previous incident contains similar database connection timeout symptoms."
            )

        # Generate conclusion
        if pool_change and log_evidence["error_count"] > 0:
            root_cause = (
                "The database connection pool configuration introduced "
                "in the latest deployment is a likely root cause."
            )
            confidence = "high"
        else:
            root_cause = (
                "Insufficient evidence to determine a specific root cause."
            )
            confidence = "low"

        return {
            "root_cause": root_cause,
            "confidence": confidence,
            "evidence": findings,
            "recommended_fix": (
                "Review the database connection pool configuration "
                "and compare it with the previous stable deployment."
            ),
            "human_approval_required": True
        }


if __name__ == "__main__":

    # Simulated output from Log Agent
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

    # Simulated output from Deployment Agent
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

    # Simulated output from Knowledge Agent
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

    print("\n===== TRACEOPS ROOT CAUSE ANALYSIS =====")

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