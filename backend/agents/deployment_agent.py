
class DeploymentAgent:

    def __init__(self, deployment_data):
        self.deployment_data = deployment_data

    def analyze(self, service):

        if not self.deployment_data:
            return {
                "status": "error",
                "message": "Deployment data not provided"
            }

        if self.deployment_data.get("timestamp_utc") is None:
            return {
                "status": "error",
                "message": "Deployment timestamp not provided"
            }

        return {
            "status": "success",
            "service": service,
            "deployment_id": self.deployment_data.get("deployment_id"),
            "deployment_time": self.deployment_data.get("timestamp_utc"),
            "deployed_by": self.deployment_data.get("deployed_by"),
            "changes": self.deployment_data.get("change_summary"),
            "commit_id": self.deployment_data.get("commit_simulated_id"),
            "deployment_status": self.deployment_data.get("status")
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