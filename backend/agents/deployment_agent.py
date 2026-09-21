from pathlib import Path
import json


class DeploymentAgent:

    def __init__(self, deployment_file):
        self.deployment_file = Path(deployment_file)

    def analyze(self, service):
        if not self.deployment_file.exists():
            return {
                "status": "error",
                "message": "Deployment file not found"
            }

        with open(self.deployment_file, "r") as file:
            deployments = json.load(file)

        # Normalize service names for flexible matching
        normalized_service = service.lower().strip()

        service_aliases = {
            "payment service": "payment-api",
            "payment-service": "payment-api",
            "payment api": "payment-api",
            "payment_api": "payment-api",
        }

        normalized_service = service_aliases.get(
            normalized_service,
            normalized_service
        )

        service_deployments = []

        for deployment in deployments:
            deployment_service = deployment["service"].lower().strip()

            if deployment_service == normalized_service:
                service_deployments.append(deployment)

        # Sort newest deployment first
        service_deployments.sort(
            key=lambda x: x["timestamp"],
            reverse=True
        )

        if not service_deployments:
            return {
                "status": "success",
                "service": service,
                "message": "No deployments found"
            }

        latest = service_deployments[0]

        return {
            "status": "success",
            "service": service,
            "latest_version": latest["version"],
            "deployment_time": latest["timestamp"],
            "changes": latest["changes"]
        }


if __name__ == "__main__":

    deployment_path = (
        Path(__file__).resolve().parents[2]
        / "data"
        / "deployments"
        / "deployments.json"
    )

    agent = DeploymentAgent(deployment_path)

    result = agent.analyze("payment service")

    print(result)