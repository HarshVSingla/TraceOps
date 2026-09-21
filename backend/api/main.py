
from fastapi import FastAPI

from pydantic import BaseModel

from backend.orchestrator import TraceOpsOrchestrator
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="TraceOps API",
    description="AI-powered software incident investigation system",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class InvestigationRequest(BaseModel):
    service: str
    incident_description: str


@app.get("/")
def root():
    return {
        "message": "TraceOps API is running",
        "status": "success"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "traceops-backend"
    }


@app.post("/investigate")
def investigate_incident(request: InvestigationRequest):

    orchestrator = TraceOpsOrchestrator()

    result = orchestrator.investigate(
        request.service,
        request.incident_description
    )

    return result