
from backend.clients.foundry_simulation_client import (
    FoundrySimulationClient
)


def main():

    client = FoundrySimulationClient()

    result = client.generate_incident(
        service_name="payment-api",
        incident_category="database_failure",
        difficulty="easy"
    )

    print("\n===== SIMULATION AGENT RESULT =====\n")
    print(result)


if __name__ == "__main__":
    main()