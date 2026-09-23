const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const verificationApi = {
  /**
   * Verifies the last investigation's diagnosis against the hidden
   * ground truth via POST /simulation/verify
   */
  async verifySimulation(simulationId) {
    if (!simulationId) {
      throw new Error("Simulation ID is required for verification.");
    }

    const response = await fetch(`${API_BASE_URL}/simulation/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        simulation_id: simulationId,
      }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.detail || `Verification failed with status ${response.status}`);
    }
  },
};