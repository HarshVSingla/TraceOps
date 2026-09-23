
# TraceOps 🔍

### A Multi-Agent AI Incident Investigation Platform

TraceOps is a multi-agent AI platform that helps software engineers investigate software incidents, correlate evidence, identify probable root causes, and recommend evidence-backed remediation steps.

The platform combines specialized AI agents, Azure AI services, and a controlled Simulation Lab to streamline the incident investigation process and evaluate diagnostic accuracy.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [AI Agents](#-ai-agents)
- [Simulation Lab](#-simulation-lab)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation and Setup](#-installation-and-setup)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Investigation Workflow](#-investigation-workflow)
- [Human-in-the-Loop](#-human-in-the-loop)
- [Future Improvements](#-future-improvements)
- [Contributors](#-contributors)
- [License](#-license)

---

## 🚀 Overview

Modern software systems generate large amounts of operational data, including application logs, deployment information, error messages, and troubleshooting documentation.

When an incident occurs, engineers often need to manually inspect multiple sources of information to identify the underlying cause. This process can be time-consuming and may result in incomplete or inaccurate diagnoses.

**TraceOps addresses this challenge by using a multi-agent architecture to automate and organize the incident investigation process.**

The platform:

1. Collects incident-related evidence.
2. Analyzes application logs.
3. Examines deployment information.
4. Retrieves relevant operational knowledge.
5. Generates a probable root-cause diagnosis.
6. Recommends possible remediation steps.
7. Supports controlled simulation and verification.

---

## ❗ Problem Statement

Software engineers spend significant time investigating incidents across scattered logs, deployment records, and knowledge sources.

Traditional incident investigation can be:

- Time-consuming.
- Difficult to standardize.
- Dependent on individual experience.
- Prone to missing important evidence.
- Difficult to evaluate objectively.

TraceOps aims to streamline this workflow through specialized AI agents that analyze available evidence and produce an explainable, evidence-backed investigation result.

---

## ✨ Key Features

### 🔍 Multi-Agent Incident Investigation

Uses specialized AI agents to divide the investigation process into smaller tasks.

### 📄 Log Analysis

Analyzes application logs to identify error patterns, abnormal behavior, and relevant symptoms.

### 🚀 Deployment Analysis

Examines deployment-related information such as service versions, deployment timestamps, and deployment context.

### 📚 Knowledge Retrieval

Uses Azure AI Search to retrieve relevant information from troubleshooting documents and previous incident reports.

### 🧠 Root-Cause Analysis

Combines evidence from different agents to generate a probable root-cause diagnosis and supporting explanation.

### 🧪 Simulation Lab

Generates controlled software incidents with hidden ground-truth causes. This allows the investigation workflow to be evaluated in a controlled environment.

### ✅ Investigation Verification

Compares the investigator's diagnosis with the hidden simulation ground truth to determine whether the diagnosis is correct, partially correct, or incorrect.

### 👤 Human-in-the-Loop

Supports human approval before recommended remediation actions are considered for execution.

### 🔐 Hidden Simulation State

The simulation's actual root cause is kept separate from the evidence provided to the investigation process.

---

## 🏗️ System Architecture

```text
                       ┌───────────────────────┐
                       │       Frontend        │
                       │     React + Vite      │
                       └───────────┬───────────┘
                                   │
                                   │ HTTP Requests
                                   ▼
                       ┌───────────────────────┐
                       │       FastAPI         │
                       │       Backend         │
                       └───────────┬───────────┘
                                   │
                ┌──────────────────┼──────────────────┐
                │                  │                  │
                ▼                  ▼                  ▼
       ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
       │   Log Agent    │ │ Deployment     │ │ Knowledge      │
       │                │ │ Agent          │ │ Agent          │
       └────────┬───────┘ └────────┬───────┘ └────────┬───────┘
                │                  │                  │
                └──────────────────┼──────────────────┘
                                   │
                                   ▼
                       ┌───────────────────────┐
                       │   Root Cause Agent    │
                       └───────────┬───────────┘
                                   │
                                   ▼
                       ┌───────────────────────┐
                       │ Investigation Result  │
                       │ Diagnosis + Evidence  │
                       │ Recommendations       │
                       └───────────────────────┘


       ┌─────────────────────────────────────────────────┐
       │                  Simulation Lab                 │
       │                                                 │
       │  Simulation Agent → Generated Incident         │
       │          │                                      │
       │          ├── Private Ground Truth              │
       │          └── Investigation Evidence            │
       │                                                 │
       │  Investigator → Diagnosis                      │
       │  Verification Agent → Evaluation               │
       └─────────────────────────────────────────────────┘
```

---

## 🤖 AI Agents

### 1. Log Agent

**Responsibility:**

- Analyze application logs.
- Identify error messages and abnormal patterns.
- Extract relevant observations from runtime evidence.
- Provide log-based findings for further investigation.

**Input:**

- Application logs.
- Incident description.
- Service information.

**Output:**

- Log analysis.
- Detected symptoms.
- Relevant evidence.

---

### 2. Deployment Agent

**Responsibility:**

- Analyze deployment-related information.
- Examine service versions and deployment timestamps.
- Identify deployment context that may be relevant to the incident.

**Input:**

- Deployment metadata.
- Service information.
- Incident details.

**Output:**

- Deployment findings.
- Potentially relevant deployment context.
- Evidence for root-cause analysis.

---

### 3. Knowledge Agent

**Responsibility:**

- Retrieve relevant information from operational knowledge sources.
- Search troubleshooting documentation and previous incident reports.
- Provide supporting information to the investigation process.

**Technology:**

- Azure AI Search.

**Knowledge sources include:**

- Troubleshooting documentation.
- Previous incident reports.
- Operational investigation guidance.

---

### 4. Root Cause Agent

**Responsibility:**

- Combine findings from other agents.
- Correlate symptoms and supporting evidence.
- Generate a probable root-cause diagnosis.
- Explain the reasoning behind the diagnosis.
- Recommend possible remediation steps.

The Root Cause Agent is designed to identify the underlying mechanism behind an incident rather than only describing its visible symptoms.

---

### 5. Simulation Agent

**Responsibility:**

- Generate controlled software incidents.
- Create application code, deployment information, and logs.
- Maintain a private ground-truth root cause.
- Provide investigation evidence without directly revealing the answer.

The generated application code is constrained by a configurable token limit, with the project requirement targeting a maximum of **2,000 tokens**.

---

### 6. Verification Agent

**Responsibility:**

- Compare the investigator's diagnosis with the simulation's hidden ground truth.
- Evaluate whether the diagnosis identifies the underlying mechanism.
- Distinguish between correct, partially correct, and incorrect diagnoses.

Example evaluation:

| Diagnosis | Evaluation |
|---|---|
| Identifies only memory usage and OOM errors | Partial |
| Identifies unbounded retention in a long-lived diagnostics store | Correct |
| Identifies an unrelated network issue | Incorrect |

---

## 🧪 Simulation Lab

The Simulation Lab allows TraceOps to test the investigation workflow using controlled incidents.

Each simulation contains two separate types of information:

### Private Simulation State

This information is maintained internally and is not directly provided to the investigator.

Examples:

- Hidden root cause.
- Expected failure mechanism.
- Simulation metadata.
- Ground-truth diagnosis.

### Investigation Evidence

This information is provided to the investigation pipeline.

Examples:

- Application code.
- Runtime logs.
- Deployment metadata.
- Service version.
- Incident description.

```text
Simulation Generation
        │
        ▼
┌─────────────────────────┐
│ Generated Application   │
│ Code + Deployment Data  │
│ + Runtime Logs          │
└────────────┬────────────┘
             │
             ├─────────────────────────┐
             ▼                         ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│ Private Ground Truth   │ │ Investigation Evidence  │
│                         │ │                         │
│ Hidden Root Cause      │ │ Logs                    │
│ Expected Mechanism     │ │ Deployment Information  │
│                         │ │ Application Code        │
└─────────────────────────┘ └────────────┬────────────┘
                                        │
                                        ▼
                              Investigation Pipeline
                                        │
                                        ▼
                              Investigator Diagnosis
                                        │
                                        ▼
                              Verification Agent
```

The private state is currently maintained in memory for the simulation workflow.

---

## 🛠️ Technology Stack

### Frontend

- React
- Vite
- JavaScript
- HTML5
- CSS3

### Backend

- Python
- FastAPI
- Uvicorn

### Artificial Intelligence

- Azure OpenAI
- Microsoft Foundry
- Multi-Agent Architecture
- Large Language Models

### Knowledge Retrieval

- Azure AI Search
- Retrieval-Augmented Investigation
- Troubleshooting Documentation
- Previous Incident Reports

### Development Tools

- Git
- GitHub
- Visual Studio Code
- Python Virtual Environment
- PowerShell

---

## 📁 Project Structure

```text
TraceOps/
│
├── backend/
│   │
│   ├── api/
│   │   ├── main.py
│   │   └── simulation_routes.py
│   │
│   ├── agents/
│   │   ├── log_agent.py
│   │   ├── deployment_agent.py
│   │   ├── knowledge_agent.py
│   │   ├── root_cause_agent.py
│   │   └── verification_agent.py
│   │
│   ├── clients/
│   │   ├── azure_openai_client.py
│   │   └── foundry_simulation_client.py
│   │
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
├── knowledge/
│   ├── previous_incidents.md
│   └── troubleshooting.md
│
├── tests/
│   └── test_foundry_simulation.py
│
├── .env
├── .gitignore
├── requirements.txt
└── README.md
```

> The structure may change as the project develops. Update this section whenever files are added, removed, or renamed.

---

## ⚙️ Prerequisites

Before running TraceOps, install the following:

- Python 3.10 or later.
- Node.js and npm.
- Git.
- Visual Studio Code.
- An Azure account with access to the required AI services.
- Azure AI Search resource.
- Microsoft Foundry project and required model deployment.

Verify your installations:

```powershell
python --version
node --version
npm --version
git --version
```

---

## 📥 Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/TraceOps.git
```

Navigate to the project directory:

```powershell
cd TraceOps
```

---

### 2. Create a Python Virtual Environment

Create the virtual environment:

```powershell
python -m venv venv
```

Activate it in PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

If PowerShell blocks script execution, open PowerShell with appropriate permissions or use the activation method supported by your local environment.

---

### 3. Install Backend Dependencies

If a `requirements.txt` file is available:

```powershell
python -m pip install -r requirements.txt
```

Otherwise, install the primary dependencies:

```powershell
python -m pip install fastapi uvicorn python-dotenv openai
```

Install any additional Azure SDK packages required by the authentication and search implementation.

---

### 4. Install Frontend Dependencies

Navigate to the frontend directory:

```powershell
cd frontend
```

Install npm dependencies:

```powershell
npm install
```

Return to the project root when required:

```powershell
cd ..
```

---

## 🔐 Environment Variables

Create a `.env` file in the appropriate project directory.

Example configuration:

```env
# Microsoft Foundry
FOUNDRY_PROJECT_ENDPOINT=your_foundry_project_endpoint
FOUNDRY_AGENT_NAME=your_foundry_agent_name

# Azure OpenAI / Model Deployment
AZURE_OPENAI_DEPLOYMENT=your_model_deployment_name

# Azure AI Search
AZURE_SEARCH_ENDPOINT=your_azure_search_endpoint
AZURE_SEARCH_KEY=your_azure_search_key
AZURE_SEARCH_INDEX=traceops-knowledge
```

### Important Security Guidelines

- Never commit your `.env` file.
- Never expose API keys in frontend code.
- Never upload secrets to GitHub.
- Add `.env` to `.gitignore`.
- Use environment variables for configuration.
- Rotate any credentials that are accidentally exposed.

Example `.gitignore` entries:

```gitignore
# Environment variables
.env
.env.*
!.env.example

# Python
venv/
__pycache__/
*.py[cod]

# Node
node_modules/
dist/

# IDE
.vscode/
.idea/

# Logs
*.log
```

---

## ▶️ Running the Project

TraceOps requires the backend and frontend to run separately.

### Start the Backend

Open a PowerShell terminal in the project root:

```powershell
cd C:\Users\Asus\OneDrive\Desktop\TraceOps
```

Activate the virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
```

Start the FastAPI server:

```powershell
python -m uvicorn backend.api.main:app --reload
```

The backend will generally be available at:

```text
http://127.0.0.1:8000
```

FastAPI interactive documentation:

```text
http://127.0.0.1:8000/docs
```

---

### Start the Frontend

Open a second terminal:

```powershell
cd C:\Users\Asus\OneDrive\Desktop\TraceOps\frontend
```

Start the Vite development server:

```powershell
npm run dev
```

Open the local URL displayed in the terminal.

The frontend and backend must both be running for the complete application workflow to function.

---

## 🔄 Investigation Workflow

The primary investigation workflow follows these stages:

```text
1. Incident Submitted
        │
        ▼
2. Evidence Collection
        │
        ▼
3. Log Agent Analysis
        │
        ▼
4. Deployment Agent Analysis
        │
        ▼
5. Knowledge Retrieval
        │
        ▼
6. Root Cause Analysis
        │
        ▼
7. Diagnosis and Explanation
        │
        ▼
8. Remediation Recommendation
        │
        ▼
9. Human Review
```

### Example Investigation Evidence

```text
Service: payment-api
Version: v2.4.0

Evidence:
- Database connection timeout errors.
- Connection pool exhaustion.
- Recent deployment metadata.
- Health-check information.
- Relevant troubleshooting documentation.
```

The agents analyze the evidence and produce a structured investigation result.

The diagnosis should distinguish between:

- Observed symptoms.
- Supporting evidence.
- Probable underlying cause.
- Recommended remediation.
- Confidence or uncertainty where applicable.

---

## 👤 Human-in-the-Loop

TraceOps is designed to support human oversight during incident response.

AI-generated remediation recommendations should be reviewed by an authorized human before execution in a production environment.

Human review helps:

- Reduce the risk of unsafe automated changes.
- Validate the proposed diagnosis.
- Confirm whether remediation is appropriate.
- Maintain accountability for operational decisions.

> The current implementation should be treated as an investigation and recommendation workflow unless automated approval and remediation execution are explicitly implemented.

---

## 🧠 Example Root-Cause Scenario

### Incident

An application experiences increasing memory usage and eventually crashes due to an out-of-memory error.

### Symptom-Level Diagnosis

```text
The application is experiencing high memory usage,
which is causing out-of-memory errors.
```

This identifies the symptoms but may not identify the underlying mechanism.

### More Specific Diagnosis

```text
The request diagnostics instrumentation stores diagnostic
data in a long-lived in-memory collection without an
eviction or cleanup mechanism. The collection continues
growing over time, causing heap retention and eventually
leading to out-of-memory errors.
```

The second diagnosis identifies a possible underlying mechanism rather than only describing the observed memory issue.

---

## 🔌 API Endpoints

The exact endpoints may change during development. The following endpoints represent the current simulation workflow.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/simulation/generate` | Generate a controlled software incident |
| `POST` | `/simulation/investigate` | Investigate generated incident evidence |
| `POST` | `/simulation/verify` | Compare the diagnosis with ground truth |

FastAPI automatically provides interactive API documentation at:

```text
http://127.0.0.1:8000/docs
```

Use the Swagger UI to inspect request schemas and test available endpoints.

---

## 🧪 Testing

Run the project tests from the project root.

Example:

```powershell
python -m pytest
```

For a specific test file:

```powershell
python -m pytest tests/test_foundry_simulation.py
```

Ensure that:

- The virtual environment is activated.
- Required environment variables are configured.
- Azure authentication is available.
- The backend package is executed from the project root.
- Required Azure resources are accessible.

---

## 🔒 Security Considerations

TraceOps may process sensitive operational information such as application logs, deployment data, and internal troubleshooting documentation.

Security considerations include:

- Protecting Azure credentials.
- Avoiding the exposure of confidential logs.
- Separating private simulation state from investigation evidence.
- Preventing secrets from being included in generated code or logs.
- Validating AI-generated remediation recommendations.
- Requiring human review before production changes.
- Applying appropriate access controls before deployment.

The current development implementation should not be considered production-ready without additional security, authentication, authorization, monitoring, and validation.

---

## 🚧 Current Limitations

- Simulation state is currently maintained in memory.
- In-memory state may be lost when the backend restarts.
- Production incident integrations are not necessarily implemented.
- Automated remediation execution requires additional safety controls.
- The quality of AI-generated diagnoses depends on the provided evidence and model responses.
- The knowledge base must be maintained and updated with relevant documentation.
- The system should be evaluated using a broader set of incident scenarios before production deployment.

---

## 🔮 Future Improvements

Potential future enhancements include:

- Persistent database support for incident history.
- Authentication and role-based access control.
- Integration with real application monitoring systems.
- Integration with cloud deployment platforms.
- Real-time log ingestion.
- More specialized investigation agents.
- Improved evidence citation and traceability.
- Confidence scoring and uncertainty detection.
- Human approval interface for remediation actions.
- Automated test generation for simulated incidents.
- Historical incident analytics.
- Incident timeline visualization.
- Production-grade monitoring and observability.
- Support for multiple projects and services.
- Containerized deployment using Docker.
- Cloud deployment of the frontend and backend.

---

## 🎯 Project Objectives

The primary objectives of TraceOps are:

1. Automate repetitive incident investigation tasks.
2. Correlate evidence from multiple operational sources.
3. Improve the consistency of root-cause analysis.
4. Provide explainable and evidence-backed diagnoses.
5. Support human oversight of remediation recommendations.
6. Evaluate AI investigation performance through controlled simulations.
7. Demonstrate the use of Azure AI services in a multi-agent application.

---

## 👥 Contributors

This project is developed as part of an academic and technical project.

| Contributor | Responsibility |
|---|---|
| Harsh Vardhan Singla | Project development, AI integration, and investigation workflow |
| Team Members | Development, testing, frontend, backend, and documentation |

Update the contributor information according to the final project team.

---

## 📄 License

This project is currently intended for educational, research, and demonstration purposes.

Add an appropriate open-source license if the project is intended to be distributed publicly.

---

## ⭐ Acknowledgements

- Microsoft Azure
- Azure OpenAI
- Microsoft Foundry
- Azure AI Search
- FastAPI
- React
- Vite
- Open-source developer community

---

## 📌 Project Status

**Status:** Active Development

TraceOps is being developed as a multi-agent AI incident investigation platform with a Simulation Lab for controlled incident generation and evaluation.
