
from backend.agents.log_agent import LogAgent
from backend.agents.deployment_agent import DeploymentAgent
from backend.agents.knowledge_agent import KnowledgeAgent
from backend.agents.root_cause_agent import RootCauseAgent


class TraceOpsOrchestrator:

    def investigate(self, investigation_evidence, prior_feedback=None):

        print("\n===== TRACEOPS INVESTIGATION STARTED =====")

        # Get generated evidence from Simulation Agent
        runtime_logs_data = investigation_evidence.get(
            "runtime_logs",
            []
        )

        if isinstance(runtime_logs_data, list):
            runtime_logs = runtime_logs_data
        elif isinstance(runtime_logs_data, dict):
            runtime_logs = runtime_logs_data.get(
                "logs",
                []
            )
        else:
            runtime_logs = []

        deployment_data = investigation_evidence.get(
            "deployment_event",
            {}
        )

        service_data = investigation_evidence.get(
            "service",
            {}
        )

        print(
            "ORCHESTRATOR DEBUG service_data:",
            service_data
        )

        service = service_data.get(
            "name",
            "unknown"
        )

        # 1. Analyze generated runtime logs
        print("\n[1/4] Running Log Agent...")

        log_agent = LogAgent(runtime_logs)
        log_evidence = log_agent.analyze()

        # 2. Analyze generated deployment metadata
        print("[2/4] Running Deployment Agent...")

        deployment_agent = DeploymentAgent(deployment_data)
        deployment_evidence = deployment_agent.analyze(
            service
        )

        # 3. Search knowledge base
        print("[3/4] Running Knowledge Agent...")

        knowledge_query = (
            f"{service} "
            f"{investigation_evidence.get('incident_category', '')}"
        )

        knowledge_agent = KnowledgeAgent()

        knowledge_evidence = knowledge_agent.search(
            knowledge_query
        )

        # 4. Determine root cause
        print("[4/4] Running Root Cause Agent...")

        root_cause_agent = RootCauseAgent()

        root_cause = root_cause_agent.analyze(
            log_evidence,
            deployment_evidence,
            knowledge_evidence,
            prior_feedback=prior_feedback
        )

        return {
            "incident_service": service,
            "log_evidence": log_evidence,
            "deployment_evidence": deployment_evidence,
            "knowledge_evidence": knowledge_evidence,
            "root_cause_analysis": root_cause
        }