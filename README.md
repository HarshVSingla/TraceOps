# TraceOps
Multi Agent AI System

                 INCIDENT
                    │
                    ▼
             ┌──────────────┐
             │ Orchestrator │
             └──────┬───────┘
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
   Log Agent   Deployment Agent  Knowledge Agent
       │            │            │
       ▼            ▼            ▼
     Logs        GitHub       Documentation
       │            │            │
       └────────────┼────────────┘
                    ▼
             Root Cause Agent
                    │
                    ▼
          Evidence-backed Cause
                    │
                    ▼
            Recommended Fix
                    │
                    ▼
             Human Approval
                    │
                    ▼
             Incident Report
             