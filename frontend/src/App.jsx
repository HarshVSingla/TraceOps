
import { useState } from "react";
import "./App.css";

function App() {
  const [service, setService] = useState("");
  const [incidentDescription, setIncidentDescription] = useState("");
  const [result, setResult] = useState(null);

  
const handleSubmit = async (event) => {
  event.preventDefault();

  setResult({
    message: "Investigating incident...",
  });

  try {
    const response = await fetch("http://127.0.0.1:8000/investigate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service,
        incident_description: incidentDescription,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Investigation failed.");
    }

    setResult(data);
  } catch (error) {
    setResult({
      message: `Error: ${error.message}`,
    });
  }
};

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>TraceOps</h1>
          <p>AI-powered incident investigation</p>
        </div>
        <span className="status">Prototype</span>
      </header>

      <main className="container">
        <section className="intro">
          <h2>Investigate a Software Incident</h2>
          <p>
            Submit an incident to analyze logs, deployments, and knowledge
            sources with AI agents.
          </p>
        </section>

        <form className="incident-form" onSubmit={handleSubmit}>
          <label htmlFor="service">Service Name</label>
          <input
            id="service"
            type="text"
            placeholder="e.g. payment-api"
            value={service}
            onChange={(event) => setService(event.target.value)}
            required
          />

          <label htmlFor="incidentDescription">Incident Description</label>
          <textarea
            id="incidentDescription"
            placeholder="Describe the incident..."
            value={incidentDescription}
            onChange={(event) => setIncidentDescription(event.target.value)}
            rows="6"
            required
          />

          <button type="submit">Start Investigation</button>
        </form>

        

{result && (
  <section className="result">
    <h2>Investigation Results</h2>

    {result.message && <p>{result.message}</p>}

    {result.root_cause_analysis ? (
      <>
        <div className="result-card">
          <h3>Incident Summary</h3>
          <p>{result.root_cause_analysis.incident_summary}</p>
        </div>

        <div className="result-card">
          <h3>Root Cause Analysis</h3>
          <p>{result.root_cause_analysis.root_cause}</p>

          <p>
            <strong>Confidence:</strong>{" "}
            {result.root_cause_analysis.confidence}
          </p>
        </div>

        <div className="result-card">
          <h3>Log Evidence</h3>

          <p>
            <strong>Total logs:</strong>{" "}
            {result.log_evidence?.total_logs ?? "N/A"}
          </p>

          <p>
            <strong>Error count:</strong>{" "}
            {result.log_evidence?.error_count ?? "N/A"}
          </p>

          {result.log_evidence?.errors?.length > 0 && (
            <ul>
              {result.log_evidence.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="result-card">
  <h3>Deployment Evidence</h3>

  {result.deployment_evidence?.latest_version ? (
    <>
      <p>
        <strong>Service:</strong>{" "}
        {result.deployment_evidence.service}
      </p>

      <p>
        <strong>Latest Version:</strong>{" "}
        {result.deployment_evidence.latest_version}
      </p>

      <p>
        <strong>Deployment Time:</strong>{" "}
        {result.deployment_evidence.deployment_time}
      </p>

      <p>
        <strong>Changes:</strong>
      </p>

      <ul>
        {result.deployment_evidence.changes?.map((change, index) => (
          <li key={index}>{change}</li>
        ))}
      </ul>
    </>
  ) : (
    <p>
      {result.deployment_evidence?.message ||
        "No deployment information available."}
    </p>
  )}
</div>

        <div className="result-card">
          <h3>Knowledge Matches</h3>

          {result.knowledge_evidence?.matches?.map((match, index) => (
            <div className="knowledge-match" key={index}>
              <h4>{match.file_name}</h4>
              <p>{match.content}</p>
            </div>
          ))}
        </div>

        <div className="result-card">
  <h3>Recommended Fix</h3>

  <p>
    {result.root_cause_analysis.recommended_fix}
  </p>
</div>

<div className="result-card">
  <h3>Verification Steps</h3>

  {result.root_cause_analysis.verification_steps?.length > 0 ? (
    <ol>
      {result.root_cause_analysis.verification_steps.map(
        (step, index) => (
          <li key={index}>{step}</li>
        )
      )}
    </ol>
  ) : (
    <p>
      No verification steps were returned.
    </p>
  )}
</div>

        {result.root_cause_analysis.human_approval_required && (
          <div className="approval-warning">
            <strong>Human approval required</strong>
            <p>
              Review the recommended fix before applying any changes.
            </p>
          </div>
        )}
      </>
    ) : (
      <pre>{JSON.stringify(result, null, 2)}</pre>
    )}
  </section>
)}
      </main>
    </div>
  );
}

export default App;