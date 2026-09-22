
import os
from typing import Any

from dotenv import load_dotenv
from azure.identity import AzureCliCredential
from azure.ai.projects import AIProjectClient


load_dotenv()


class FoundrySimulationClient:

    def __init__(self):
        self.project_endpoint = os.getenv(
            "FOUNDRY_PROJECT_ENDPOINT"
        )

        self.agent_name = os.getenv(
            "FOUNDRY_AGENT_NAME"
        )

        if not self.project_endpoint:
            raise ValueError(
                "FOUNDRY_PROJECT_ENDPOINT is missing from .env"
            )

        if not self.agent_name:
            raise ValueError(
                "FOUNDRY_AGENT_NAME is missing from .env"
            )

        self.project = AIProjectClient(
            endpoint=self.project_endpoint,
            credential=AzureCliCredential()
        )

        self.openai = self.project.get_openai_client(
            agent_name=self.agent_name
        )

    def generate_incident(
        self,
        service_name: str = "payment-api",
        incident_category: str = "database_failure",
        difficulty: str = "easy"
    ) -> str:

        prompt = f"""
Generate one simulated software incident for TraceOps.

Input:
Service name: {service_name}
Incident category: {incident_category}
Difficulty: {difficulty}

Requirements:
- Follow all your configured agent instructions.
- Keep generated application code within 2000 tokens.
- Use general error messages.
- Do not reveal the hidden ground-truth root cause.
- Do not claim that simulated data is real production evidence.
- Respect the maximum of 3 fixing attempts.
- Return the structured simulation result requested by your instructions.

Generate one incident now.
"""

        response = self.openai.responses.create(
            input=prompt
        )

        return response.output_text