from pathlib import Path

from backend.agents.log_agent import LogAgent
from backend.agents.deployment_agent import DeploymentAgent
from backend.agents.knowledge_agent import KnowledgeAgent
from backend.agents.root_cause_agent import RootCauseAgent


class TraceOpsOrchestrator:

    def __init__(self):

        base_path = Path(__file__).resolve().parents[1]

        self.log_agent = LogAgent(
            base_path / "data" / "logs" / "api.log"
        )

        self.deployment_agent = DeploymentAgent(
            base_path / "data" / "deployments" / "deployments.json"
        )


        self.knowledge_agent = KnowledgeAgent()

        self.root_cause_agent = RootCauseAgent()

    def investigate(self, service):

        print("\n===== TRACEOPS INVESTIGATION STARTED =====")

        # 1. Analyze logs
        print("\n[1/4] Running Log Agent...")
        log_evidence = self.log_agent.analyze()

        # 2. Analyze deployments
        print("[2/4] Running Deployment Agent...")
        deployment_evidence = self.deployment_agent.analyze(service)

        # 3. Search knowledge
        print("[3/4] Running Knowledge Agent...")
        knowledge_evidence = self.knowledge_agent.search("database connection")
            

        # 4. Determine root cause
        print("[4/4] Running Root Cause Agent...")
        root_cause = self.root_cause_agent.analyze(
            log_evidence,
            deployment_evidence,
            knowledge_evidence
        )

        return {
            "incident_service": service,
            "log_evidence": log_evidence,
            "deployment_evidence": deployment_evidence,
            "knowledge_evidence": knowledge_evidence,
            "root_cause_analysis": root_cause
        }


if __name__ == "__main__":

    orchestrator = TraceOpsOrchestrator()

    result = orchestrator.investigate("payment-api")

    print("\n===== FINAL INVESTIGATION =====")

    print("\nRoot Cause:")
    print(result["root_cause_analysis"]["root_cause"])

    print("\nConfidence:")
    print(result["root_cause_analysis"]["confidence"])

    print("\nEvidence:")

    for evidence in result["root_cause_analysis"]["evidence"]:
        print("-", evidence)

    print("\nRecommended Fix:")
    print(result["root_cause_analysis"]["recommended_fix"])

    print("\nHuman Approval Required:")
    print(
        result["root_cause_analysis"]
        ["human_approval_required"]
    )