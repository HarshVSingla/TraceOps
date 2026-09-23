
import json
import os

from dotenv import load_dotenv
from azure.identity import AzureCliCredential
from azure.ai.projects import AIProjectClient
from backend.orchestrator import TraceOpsOrchestrator

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field


load_dotenv()


# ---------------------------------------------------------
# ROUTER
# ---------------------------------------------------------

router = APIRouter(
    prefix="/simulation",
    tags=["Simulation Engine"]
)
# ---------------------------------------------------------
# IN-MEMORY SIMULATION STATE
# ---------------------------------------------------------

simulation_store = {}

# ---------------------------------------------------------
# REQUEST MODEL
# ---------------------------------------------------------

class SimulationRequest(BaseModel):

    service_name: str = Field(
        default="payment-api",
        min_length=1,
        max_length=100
    )

    incident_category: str = Field(
        default="database_failure",
        min_length=1,
        max_length=50
    )

    difficulty: str = Field(
        default="easy",
        pattern="^(easy|medium|hard)$"
    )

    execution_required: bool = True

    include_code_diff: bool = True

    include_deployment_data: bool = True

    include_runtime_logs: bool = True

    # Project-level limits
    max_code_tokens: int = Field(
        default=4000,
        le=4000
    )

    max_fix_attempts: int = Field(
        default=3,
        le=3
    )

    # Must remain false for investigation runs
    expose_ground_truth: bool = False


# ---------------------------------------------------------
# RESPONSE MODEL
# ---------------------------------------------------------

class SimulationResponse(BaseModel):

    status: str

    simulation_id: str

    service_name: str

    incident_category: str

    investigation_evidence: dict


class InvestigationRequest(BaseModel):

    simulation_id: str = Field(
        min_length=1
    )

# ---------------------------------------------------------
# FOUNDRY CLIENT
# ---------------------------------------------------------

# We use ask_gpt instead of AIProjectClient to avoid requiring local Azure CLI auth
from backend.clients.azure_openai_client import ask_gpt

# ---------------------------------------------------------
# PROMPT BUILDER
# ---------------------------------------------------------

SCHEMA_CONTRACT = """
INVESTIGATION_EVIDENCE MUST use EXACTLY this schema. Do not rename any
field, do not omit any field (use null, {}, or [] if a value is not
applicable), and do not introduce alternative field names.

{
  "simulated": true,
  "service": {
    "name": "string",
    "version": "string",
    "language": "string",
    "runtime": "simulated"
  },
  "incident_category": "string",
  "deployment_event": {
    "deployment_id": "string",
    "timestamp_utc": "string",
    "change_summary": "string",
    "commit_simulated_id": "string",
    "deployed_by": "string",
    "status": "string"
  },
  "runtime_logs": {
    "simulated": true,
    "logs": [
      {"timestamp_utc": "string", "level": "ERROR|WARN|INFO", "message": "string"}
    ]
  },
  "code_diff": {},
  "execution": {},
  "observed_metrics": {},
  "tests_and_validation": {}
}

Field name rules (violating any of these is a failure):
- Use "runtime_logs.logs" — never "runtime_logs.entries".
- Use "deployment_event" — never "deployment_metadata".
- Use "service" as an object — never a flat "service_name" string.
- Use "deployment_event.timestamp_utc" and "deployment_event.status" —
  never "deployment_timestamp_utc", "deployment_status", or "service_version".
"""


def build_simulation_prompt(
    request: SimulationRequest
) -> str:

    simulation_input = {
        "service_name": request.service_name,
        "incident_category": request.incident_category,
        "difficulty": request.difficulty,
        "execution_required": request.execution_required,
        "include_code_diff": request.include_code_diff,
        "include_deployment_data": request.include_deployment_data,
        "include_runtime_logs": request.include_runtime_logs,
        "max_code_tokens": 4000,
        "max_fix_attempts": 3,
        "expose_ground_truth": False
    }

    return f"""
Generate one controlled, simulated software incident
for the TraceOps investigation system.

The following input is provided as JSON:

{json.dumps(simulation_input, indent=2)}

Follow all your configured Simulation Agent instructions.

Mandatory requirements:

1. Generate only one incident.
2. Keep generated application code at or below 4,000 tokens.
3. Use general observable error messages.
4. Do not reveal the hidden ground-truth root cause
   in the investigation evidence.
5. Clearly mark all evidence as simulated.
6. Do not claim that a real production system was monitored.
7. Respect a maximum of 3 fixing attempts.
8. Stop fixing after the third failed attempt.
9. Do not execute destructive operations.
10. Return a structured result.
11. Separate private simulation state from
    investigation evidence.
12. Do not expose secrets, credentials, or tokens.

You MUST return a JSON object with EXACTLY this structure at the root:
{{
  "simulation_id": "string (a generated unique ID)",
  "PRIVATE_SIMULATION_STATE": {{
    "ground_truth_root_cause": "string",
    "difficulty": "string"
  }},
  "INVESTIGATION_EVIDENCE": {{
    "simulated": true,
    "service": {{}},
    "incident_category": "string",
    "deployment_event": {{}},
    "runtime_logs": {{"simulated": true, "logs": []}}
  }}
}}

{SCHEMA_CONTRACT}

Return ONLY the JSON simulation result now, starting with {{ and ending with }}. Do not add any markdown formatting or extra text.
"""


# ---------------------------------------------------------
# PARSE SIMULATION RESULT
# ---------------------------------------------------------

def parse_simulation_result(agent_output: str) -> dict:

    cleaned_output = agent_output.strip()

    # Remove Markdown JSON fences if the agent adds them.
    if cleaned_output.startswith("```json"):
        cleaned_output = cleaned_output[7:]

    elif cleaned_output.startswith("```"):
        cleaned_output = cleaned_output[3:]

    if cleaned_output.endswith("```"):
        cleaned_output = cleaned_output[:-3]

    cleaned_output = cleaned_output.strip()

    try:
        result = json.loads(cleaned_output)

    except json.JSONDecodeError as error:
        raise ValueError(
            f"Simulation Agent did not return valid JSON: {error}"
        )

    required_sections = [
        "simulation_id",
        "PRIVATE_SIMULATION_STATE",
        "INVESTIGATION_EVIDENCE"
    ]

    for section in required_sections:
        if section not in result:
            print(f"Warning: Missing {section} in result, auto-filling...")
            if section == "simulation_id":
                result[section] = "sim_12345_auto"
            elif section == "PRIVATE_SIMULATION_STATE":
                result[section] = {"ground_truth_root_cause": "Auto-filled state"}
            elif section == "INVESTIGATION_EVIDENCE":
                # If INVESTIGATION_EVIDENCE is missing, perhaps the whole result IS the evidence
                if "deployment_event" in result or "runtime_logs" in result:
                    result["INVESTIGATION_EVIDENCE"] = result.copy()
                    for k in required_sections:
                        result["INVESTIGATION_EVIDENCE"].pop(k, None)
                else:
                    raise ValueError(f"Simulation result is completely missing: {section}")

    evidence = result["INVESTIGATION_EVIDENCE"]

    if not isinstance(evidence.get("service"), dict):
        raise ValueError(
            "INVESTIGATION_EVIDENCE.service must be an object"
        )

    if not isinstance(evidence.get("deployment_event"), dict):
        raise ValueError(
            "INVESTIGATION_EVIDENCE.deployment_event must be an object"
        )

    runtime_logs = evidence.get("runtime_logs")

    if not isinstance(runtime_logs, dict) or not isinstance(
        runtime_logs.get("logs"), list
    ):
        raise ValueError(
            "INVESTIGATION_EVIDENCE.runtime_logs.logs must be a list"
        )

    if not isinstance(evidence.get("incident_category"), str):
        raise ValueError(
            "INVESTIGATION_EVIDENCE.incident_category must be a string"
        )

    return result


# ---------------------------------------------------------
# GENERATE SIMULATION
# ---------------------------------------------------------

@router.post(
    "/generate",
    response_model=SimulationResponse
)
def generate_simulation(
    request: SimulationRequest
):

    # Enforce fixed project limits on the server side.
    if request.max_code_tokens > 4000:
        raise HTTPException(
            status_code=400,
            detail="Maximum code token limit is 4000."
        )

    if request.max_fix_attempts > 3:
        raise HTTPException(
            status_code=400,
            detail="Maximum fix attempts limit is 3."
        )

    if request.expose_ground_truth:
        raise HTTPException(
            status_code=400,
            detail=(
                "Ground truth cannot be exposed "
                "during investigation runs."
            )
        )

    try:

        prompt = build_simulation_prompt(request)
        agent_output = ask_gpt(prompt)
        
        # Remove markdown JSON fences if present
        if agent_output.startswith("```json"):
            agent_output = agent_output.replace("```json", "").replace("```", "").strip()

        print("DEBUG RAW AGENT OUTPUT:\n", agent_output)

        if not agent_output:
            raise HTTPException(
                status_code=502,
                detail="Foundry agent returned an empty response."
            )

        # Parse and validate the structured simulation result.
        try:
            simulation = parse_simulation_result(agent_output)

        except ValueError as error:
            raise HTTPException(
                status_code=502,
                detail=str(error)
            )

        # Extract private state and investigation evidence.
        simulation_id = simulation["simulation_id"]

        private_state = simulation["PRIVATE_SIMULATION_STATE"]

        investigation_evidence = simulation["INVESTIGATION_EVIDENCE"]

        print(
    "DEBUG service:",
    investigation_evidence.get("service")
    )

        print("DEBUG runtime_logs:",investigation_evidence.get("runtime_logs"))

        print(
    "DEBUG deployment_event:",
    investigation_evidence.get("deployment_event")
)
    

        # Store private state on the backend.
        # This must NEVER be returned to the investigator.
        simulation_store[simulation_id] = {
            "private_state": private_state,
            "investigation_evidence": investigation_evidence,
            "attempts": [],
            "status": "active"
        }

        # Return ONLY investigation evidence.
        return SimulationResponse(
            status="completed",
            simulation_id=simulation_id,
            service_name=request.service_name,
            incident_category=request.incident_category,
            investigation_evidence=investigation_evidence
        )

    except HTTPException:
        raise

    except Exception as error:

        print(
            "Simulation Agent Error:",
            str(error)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Simulation Agent execution failed. "
                "Check the backend terminal for details."
            )
        )

# ---------------------------------------------------------
# RUN INVESTIGATION
# ---------------------------------------------------------

@router.post("/investigate")
def investigate_simulation(
    request: InvestigationRequest
):

    simulation = simulation_store.get(
        request.simulation_id
    )

    if not simulation:
        raise HTTPException(
            status_code=404,
            detail="Simulation not found."
        )

    if simulation["status"] != "active":
        raise HTTPException(
            status_code=400,
            detail="Simulation is not active."
        )

    # IMPORTANT:
    # Only investigation evidence is passed to the
    # investigation agents.
    investigation_evidence = simulation[
        "investigation_evidence"
    ]

    try:

        orchestrator = TraceOpsOrchestrator()

        investigation_result = orchestrator.investigate(
            investigation_evidence
        )

        return {
            "status": "completed",
            "simulation_id": request.simulation_id,
            "investigation": investigation_result
        }

    except Exception as error:

        print(
            "Investigation Error:",
            str(error)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Investigation execution failed. "
                "Check the backend terminal for details."
            )
        )